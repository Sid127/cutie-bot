// require file containing the commodity ID data
const commodities = require("../../functionFiles/commodities.json");
// require for the EDDB page call
const { asyncEDDBPage } = require("../../functionFiles/APICalls.js");

exports.run = async(client, message, args) => {
	// check for empty string input
	if (args.trim().length === 0) {
		return message.reply("I can be more useful if you would give me a commodity name...");
	}

	// search for the commodity
	const foundItem = commodities.find(elem => elem.name.toLowerCase() === args.trim().toLowerCase());

	// if found returned an undefined, let user know
	if (!foundItem) {
		return message.reply(`Commodity: \`${args.replace(/\`/g, "")}\` was not found. Typo?`);
	}

	// check if user asked for a non tradeable commodity
	if (foundItem.non_tradeable) {
		return message.reply(`Why are you trying to search for prices for non tradeable items? \`${foundItem.name}\``);
	}

	// send temp message
	let tempMessage = await message.channel.send("Retrieving data...");

	// get the HTML page from EDDB.io for the commodity.. since there is no good API to use for said data
	const eddbPage = await asyncEDDBPage(`/commodity/${foundItem.id}`);

	// split out useless info from the HTML page (not quite all of it tho)
	let parsedPage = [];
	let dataIndexes = {};
	// loop through the page data, splitting by line
	for (line of eddbPage.data.split(`\n`)) {
		let changedLine = line.trim();
		// check if there is a /station or /system string in the line, if there is, don't change it, otherwise leave just normal characters and numbers left
		if (!changedLine.includes("/station") && !changedLine.includes("/system")) {
			changedLine = changedLine.replace(/\<[\s\S]*?\>/g, "").trim();
		}

		// find the indexes for the data points we want
		if (changedLine.toLowerCase().includes("average price")) {
			dataIndexes.averageIndex = parsedPage.length;
		} else if (changedLine.toLowerCase().includes("maximum selling stations")) {
			dataIndexes.maxSellIndex = parsedPage.length;
		} else if (changedLine.toLowerCase().includes("minimum buying stations")) {
			dataIndexes.minBuyIndex = parsedPage.length;
		}

		// if the line isn't empty, just push it to the parsed page
		if (changedLine !== "") {
			parsedPage.push(changedLine)
		}
	}

	// create an object which will hold the output data
	let outputObject = {
		minBuyStations: [],
		maxSellStations: []
	}
	// check if dataIndexes includes the averageIndex to be able to find the data
	if (dataIndexes.averageIndex) {
		outputObject.galNumbers = getGalNumbers(parsedPage.slice(dataIndexes.averageIndex, dataIndexes.averageIndex + 10));
	}
	// check for min buy index
	if (dataIndexes.minBuyIndex) {
		outputObject.minBuyStations = getStationData(parsedPage.slice(dataIndexes.minBuyIndex, dataIndexes.minBuyIndex + 100), "Buy");
	}
	// check for max sell index
	if (dataIndexes.maxSellIndex) {
		outputObject.maxSellStations = getStationData(parsedPage.slice(dataIndexes.maxSellIndex, dataIndexes.maxSellIndex + 100), "Sell");
	}

	// variable for the embed
	let embed = {
		"title": `${foundItem.name} (${foundItem.category})`,
		"url": `https://eddb.io/commodity/${foundItem.id}`,
		"color": 7864575,
		"footer": {
			"text": "Information from EDDB"
		},
		"fields": [outputObject.galNumbers]
	}

	// push the data from the buy and sell stations
	embed.fields = embed.fields.concat(outputObject.minBuyStations, outputObject.maxSellStations);

	// edit the temp message with the data we got
	tempMessage.edit({embeds: [embed], content: "Data below.."});
};

exports.config = {
	guildOnly: true,
	aliases: ["prices"],
	permLevel: "User",
	name: "price",
	description: "Shows latest info for the specified commodity.",
	usage: ["[<commodity>]"]
};

// some helper functions for this command only
function getGalNumbers(inputArr) {
	let data = {
		average: parseInt(inputArr[1].replace(/[^0-9]/g, "")),
		minBuy: parseInt(inputArr[inputArr.findIndex(elem => elem.toLowerCase().includes("minimum buy")) + 1].replace(/[^0-9]/g, "")),
		maxSell: parseInt(inputArr[inputArr.findIndex(elem => elem.toLowerCase().includes("maximum sell")) + 1].replace(/[^0-9]/g, ""))
	}

	return {
		"name": `Galactic info`,
		"value":
			`Maximum sell price: ${data.maxSell ? `**${data.maxSell.toLocaleString("se")}** Cr.` : "**Cannot be sold.**"}\n` +
			`Minimum buy price: ${data.minBuy ? `**${data.minBuy.toLocaleString("se")}** Cr.` : "**Cannot be bought.**"}\n\n` +
			`Maximum profit: **${((data.maxSell ? data.maxSell : 0) - (data.minBuy ? data.minBuy : 0)).toLocaleString("se")}** Cr.\n` +
			`Galactic average: **${data.average.toLocaleString("se")}** Cr.`
	}
}

function getStationData(inputArr, type) {
	// variable creation
	const numOfStations = 3;
	let index = 7
	let tempData = []
	let returnData = [];

	// find the number of stations wanted
	for (let i = 0; i < numOfStations; i++) {
		let stationData = {};

		// station name and ID, as well as system name and ID
		stationData.stationName = inputArr[index].replace(/\<[\s\S]*?\>/g, "").trim();
		stationData.stationID = inputArr[index].split("href=")[1].split("\"")[1].trim();

		stationData.systemName = inputArr[index + 1].replace(/\<[\s\S]*?\>/g, "").trim();
		stationData.systemID = inputArr[index + 1].split("href=")[1].split("\"")[1].trim();

		// get the price, depand, pad size and updated times
		stationData.price = parseInt(inputArr[index + 2].replace(/[^0-9]/g, ""));
		stationData.demand = parseInt(inputArr[index + 4].replace(/[^0-9]/g, ""));
		stationData.padSize = inputArr[index + 5];
		// a weird thing with the way the HTML page loads the code..
		type === "Buy" ? stationData.lastUpdated = inputArr[index + 6].split("}}")[1] : stationData.lastUpdated = inputArr[index + 7].split(">")[1]

		// add the station data to the return array, and add 8 to the index, since that's the amount for the next station
		tempData.push(stationData)

		// a weird thing with the way the HTML page loads the code..
		type === "Buy" ? index += 7 : index += 8
	}

	// create the output objects for the fields in the embed
	for (let [index, system] of tempData.entries()) {
		returnData.push({
			"name": `${type} ${index + 1}`,
			"value":
				`**[${system.systemName}](https://eddb.io${system.systemID})**\n` +
				`[${system.stationName}](https://eddb.io${system.stationID})\n` +
				`Price: **${system.price.toLocaleString("se")}** Cr\n` +
				`Demand: **${system.demand.toLocaleString("se")}**\n` +
				`Largest Pad: **${system.padSize}**\n` +
				`Updated: **${system.lastUpdated}** ago`,
			"inline": true
		});
	}

	return returnData;
}
