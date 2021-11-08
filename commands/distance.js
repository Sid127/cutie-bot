// our own API caller and helper files
const { asyncEDSM } = require("../functionFiles/APICalls.js");
const { distanceCalc } = require("../functionFiles/helperFunctions.js");

exports.run = async(client, message, args) => {
	// check for empty args
	if (args.trim().length === 0) {
		return message.reply("I'd like two system names, please.");
	}

	// split out systems and other data
	const [system1 = "", system2 = ""] = args.split(", ");

	// check if either system is empty, if so, reply about it
	if (system1.trim() === "" || system2.trim() === "") {
		return message.reply("Two systems separated by a comma would be nice.");
	}

	// send temp message
	let tempMessage = await message.channel.send("Retrieving data...");

	// create API calls, and set them in a promise.all() to wait for everything to come back
	let [sys1Data, sys2Data] = await Promise.all([
		asyncEDSM("/api-v1/system", {"showCoordinates": 1, "systemName": system1}),
		asyncEDSM("/api-v1/system", {"showCoordinates": 1, "systemName": system2})
	]);

	// check if either system is empty
	if (sys1Data.data.length === 0 || sys2Data.data.length === 0) {
		return tempMessage.edit(`Couldn't find data about ` +
		`\`${(!sys1Data.data.name && !sys2Data.data.name) ? `${system1.replace(/\`/g, "")}\` nor \`${system2.replace(/\`/g, "")}` : (!sys1Data.data.name ? system1.replace(/\`/g, "") : system2.replace(/\`/g, ""))}\`.\n` +
		`Please check your spelling... Or that EDSM has the data.`);
	}

	// if we're this far in, we should have the data, do distance calculation and edit temp message
	tempMessage.edit(`Distance between \`${sys1Data.data.name}\` and \`${sys2Data.data.name}\` is \`${distanceCalc(sys1Data.data.coords, sys2Data.data.coords, 2)}\`Ly.`);
};

exports.config = {
	guildOnly: true,
	aliases: ["dist"],
	permLevel: "User",
	name: "distance",
	category: "Elite",
	description: "Calculates distance between two systems",
	usage: ["[<system 1>], [<system 2>]"]
};
