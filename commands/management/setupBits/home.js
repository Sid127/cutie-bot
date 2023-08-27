// module requires
const { codeBlock } = require("discord.js");
const { AxiosEDSM } = require("../../../functionFiles/APICalls.js");
const { checkForStations } = require('../../../functionFiles/helperFunctions');

exports.run = async (client, message, args) => {
	// create a template variable holding the object to be sent
	let template = {system: "<system name>", station: "<station name>", faction: "<faction name>", homeImageURL: "<Discord image link>",
	encodedTrader: "<nearest system>", manufacturedTrader: "<nearest system>", rawTrader: "<nearest system>",
	guardianBroker: "<nearest system>", humanBroker: "<nearest system>", iFactor: "<nearest system>", fcVendor: "<nearest system>", fcAdmin: "<nearest system>"};

	// give a way to provide the template
    if (!args[0] || args[0].toLowerCase() === "template") {
		// return back the data
		return message.channel.send({content: `\`setup home list\` to show current data, \`setup home delete|remove\` to delete home data.\n` +
			`Use this template as an input, removing the <> characters and if you do not fill in some bits, you can remove that line.\n` +
			`${codeBlock("json", JSON.stringify(template, null, "\t"))}`});
    }

	// get the currently stored data and edit it slightly
	let currentHomeData = await client.serverData.get(`${message.guild.id}.home`);
	for (let [key, value] of Object.entries(currentHomeData)) {
		if (typeof(value) === "object" && value) {
			currentHomeData[key] = value.system;
		}
		if (key.match(/(systemid|stationid|factionid)/gi)) {
			delete currentHomeData[key]
		}
	}

	// check on if we want to remove the home system from use
	if (args[0].toLowerCase().match("(delete|remove)")) {
		await client.serverData.set(`${message.guild.id}.home`, {system: null});
		return message.reply({content: `Home data was removed.\nYou can use \`${client.prefix}setup home list\` to make sure, if it was not, contact my devs.\n\n` +
			`If this was a mistake, use \`${client.prefix}setup home\`to set it again. I have the old data below:\n` +
			`${codeBlock("json", JSON.stringify(currentHomeData, null, "\t"))}`});
	}

	// check if we want to list the data we have
	if (args[0].toLowerCase() === "list") {
		return message.reply({content: `Current data found:\n${codeBlock("json", JSON.stringify(currentHomeData, null, "\t"))}`});
	}

	// send temp message
	let tempMessage = await message.channel.send("Hang tight, this is gonna take a while...");

	// check if the .home key data is an object, if not, set empty
	if (typeof currentHomeData !== "object") {
		await client.serverData.ensure(`${message.guild.id}.home`, {system: null});
	}

	// check if we have any of the text hints, if not parse the JSON got as input
    if (args.join(" ").match("(<|>|name|nearest)")) return tempMessage.edit("I TOLD you to remove the text hints >:(");

    let data = "";
	try {
		data = JSON.parse(args.join(" ").replace(/(\r\n|\n|\r|\t)/gm, "")); // create json
	} catch (err) {
		return tempMessage.edit(`Couldn't find valid JSON input, please check \`${client.prefix}setup home template\` for input.`);
	}

	// variable to hold the names of all the special data bits (things found in other systems)
	// IMPORTANT!!! These need to be in the same order (and same amount) as the bits going into the ...rest variables
	const serviceNames = [
		{keyName: "encodedTrader", 		serviceName: "Material Trader", 				fullName: "Encoded Materials Trader"},
		{keyName: "manufacturedTrader", serviceName: "Material Trader", 				fullName: "Manufactured Materials Trader"},
		{keyName: "rawTrader", 			serviceName: "Material Trader", 				fullName: "Raw Materials Trader"},
		{keyName: "guardianBroker",		serviceName: "Technology Broker", 				fullName: "Guardian Tech Broker"},
		{keyName: "humanBroker", 		serviceName: "Technology Broker", 				fullName: "Human Tech Broker"},
		{keyName: "iFactor", 			serviceName: "Interstellar Factors Contact", 	fullName: "Interstellar Factor"},
		{keyName: "fcVendor", 			serviceName: "Tuning", 							fullName: "Fleet Carrier Vendor"},
		{keyName: "fcAdmin", 			serviceName: "Tuning", 							fullName: "Fleet Carrier Administrator"}
	];

    // make all our station data API calls at once
    let [stations, factions, ...restStationData] = await Promise.all([
        data.station ? AxiosEDSM('/api-system-v1/stations', {"systemName": data.system || currentHomeData.system}) : undefined,
		data.faction ? AxiosEDSM('/api-system-v1/factions', {"systemName": data.system || currentHomeData.system}) : undefined,
        data.encodedTrader ? AxiosEDSM('/api-system-v1/stations', {"systemName": data.encodedTrader}) : undefined,
        data.manufacturedTrader ? AxiosEDSM('/api-system-v1/stations', {"systemName": data.manufacturedTrader}) : undefined,
        data.rawTrader ? AxiosEDSM('/api-system-v1/stations', {"systemName": data.rawTrader}) : undefined,
        data.guardianBroker ? AxiosEDSM('/api-system-v1/stations', {"systemName": data.guardianBroker}) : undefined,
        data.humanBroker ? AxiosEDSM('/api-system-v1/stations', {"systemName": data.humanBroker}) : undefined,
        data.iFactor ? AxiosEDSM('/api-system-v1/stations', {"systemName": data.iFactor}) : undefined,
        data.fcVendor ? AxiosEDSM('/api-system-v1/stations', {"systemName": data.fcVendor}) : undefined,
        data.fcAdmin ? AxiosEDSM('/api-system-v1/stations', {"systemName": data.fcAdmin}) : undefined
    ]);

    // make all our system data API calls at once
    let [systemCoords, ...restCoordsData] = await Promise.all([
        data.system ? AxiosEDSM('/api-v1/system', {"showCoordinates": 1, "systemName": data.system || currentHomeData.system}) : undefined,
        data.encodedTrader ? AxiosEDSM('/api-v1/system', {"showCoordinates": 1, "systemName": data.encodedTrader}) : undefined,
        data.manufacturedTrader ? AxiosEDSM('/api-v1/system', {"showCoordinates": 1, "systemName": data.manufacturedTrader}) : undefined,
        data.rawTrader ? AxiosEDSM('/api-v1/system', {"showCoordinates": 1, "systemName": data.rawTrader}) : undefined,
        data.guardianBroker ? AxiosEDSM('/api-v1/system', {"showCoordinates": 1, "systemName": data.guardianBroker}) : undefined,
        data.humanBroker ? AxiosEDSM('/api-v1/system', {"showCoordinates": 1, "systemName": data.humanBroker}) : undefined,
        data.iFactor ? AxiosEDSM('/api-v1/system', {"showCoordinates": 1, "systemName": data.iFactor}) : undefined,
        data.fcVendor ? AxiosEDSM('/api-v1/system', {"showCoordinates": 1, "systemName": data.fcVendor}) : undefined,
        data.fcAdmin ? AxiosEDSM('/api-v1/system', {"showCoordinates": 1, "systemName": data.fcAdmin}) : undefined
    ]);

	tempMessage.edit("System data acquired, verifying things...");

	// variable for what to set
	let newHomeData = {};
	let problems = [];

	// if the currently stored data doesn't have a home system set, require it to be set on first run, otherwise return out
	if (!currentHomeData.system && !data.system) {
		return tempMessage.edit("...I should've told you I need your home system as well, can't skip this on first run.");
	}

	// start checking for what's given in
	if (data.system) { Object.keys(systemCoords).length > 0 ? newHomeData.system = systemCoords.name : problems.push("Home system") }

	// special check for home station and faction
	if (data.station && Object.keys(stations).length > 0 && stations.stations.length > 0) {
		let found = stations.stations.filter(elem => elem.name.toLowerCase() === data.station.toLowerCase());
		if (found.length > 0) {
			newHomeData.systemID = stations.id;
			newHomeData.station = found[0].name;
			newHomeData.stationID = found[0].id;
		} else {problems.push("Home station")}
	}

	if (data.faction && Object.keys(factions).length > 0 && factions.factions.length > 0) {
		let found = factions.factions.filter(elem => elem.name.toLowerCase() === data.faction.toLowerCase());
		if (found.length > 0) {
			newHomeData.systemID = factions.id;
			newHomeData.faction = found[0].name;
			newHomeData.factionID = found[0].id;
		} else {problems.push("Home faction")}
	}

	// check if all the 4 arrays needed are the same length
	if (serviceNames.length !== restStationData.length || serviceNames.length !== restCoordsData.length) {
		return tempMessage.edit("Please let my devs know something's off.");
	}

	// loop over all the extra bits
	for (let i = 0; i < serviceNames.length; i++) {
		// check if data got for both inputs
		if (restStationData[i] && restCoordsData[i] && Object.keys(restStationData[i]).length > 0 && Object.keys(restCoordsData[i]).length > 0) {
			let returnData = checkForStations(restStationData[i], serviceNames[i].serviceName, systemCoords, restCoordsData[i]);
			if (returnData) {
				returnData.fullName = serviceNames[i].fullName;
				newHomeData[serviceNames[i].keyName] = returnData;
			} else {problems.push(`${serviceNames[i].fullName}`)}
		}
	}

	if (problems.length > 0) {
		return tempMessage.edit(`Had issues finding some things: \`${problems.join(", ")}\` please check you spelled things right`)
	} else {
		await client.serverData.update(`${message.guild.id}.home`, newHomeData);
		return tempMessage.edit("All Done!");
	}
}
