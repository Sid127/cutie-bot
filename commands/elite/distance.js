// our own API caller and helper files
const { asyncEDSM } = require("../../functionFiles/APICalls.js");
const { distanceCalc } = require("../../functionFiles/helperFunctions.js");

exports.run = async(client, message, args) => {
	// check for empty args
	if (args.trim().length === 0) {
		return message.reply("I'd like two comma separated inputs, please.");
	}

	// split out systems and other data
	const [input1 = "", input2 = ""] = args.split(", ");

	// check if either system is empty, if so, reply about it
	if (input1.trim() === "" || input2.trim() === "") {
		return message.reply("Two inputs separated by a comma would be nice.");
	}

	// send temp message
	let tempMessage = await message.channel.send("Retrieving data...");

	// create API calls, and set them in a promise.all() to wait for everything to come back
	// ternaries for checking if a cmdr data or a system was given
	let [input1Data, input2Data] = await Promise.all([
		(input1.toLowerCase().startsWith("cmdr")
			? asyncEDSM("/api-logs-v1/get-position", {"showCoordinates": 1, "commanderName": input1.slice(4).trim()})
			: asyncEDSM("/api-v1/system", {"showCoordinates": 1, "systemName": input1})),

		(input2.toLowerCase().startsWith("cmdr")
			? asyncEDSM("/api-logs-v1/get-position", {"showCoordinates": 1, "commanderName": input2.slice(4).trim()})
			: asyncEDSM("/api-v1/system", {"showCoordinates": 1, "systemName": input2}))
	]);

	// check for validity of the data got back
	if (checkForMissingData(input1Data.data) || checkForMissingData(input2Data.data)) {
		return tempMessage.edit(`Couldn't find data about ` +
		`\`${((!input1Data.data.name && !input1Data.data.url) && (!input2Data.data.name && !input2Data.data.url))
			? `${input1.replace(/\`/g, "")}\` nor \`${input2.replace(/\`/g, "")}`
			: ((!input1Data.data.name && !input1Data.data.url) ? input1.replace(/\`/g, "") : input2.replace(/\`/g, ""))}\`.\n` +
		`Please check your spelling... Or that EDSM has the data.`);
	}

	// if we're this far in, we should have the data, do distance calculation and edit temp message
	tempMessage.edit(`Distance between ` +
		`\`${input1Data.data.name || `CMDR ` + input1Data.data.url.split("/").pop().replace(/\+/g, " ") + ` (` + input1Data.data.system + `)`}\` and ` +
		`\`${input2Data.data.name || `CMDR ` + input2Data.data.url.split("/").pop().replace(/\+/g, " ") + ` (` + input2Data.data.system + `)`}\` is ` +
		`\`${distanceCalc(input1Data.data.coords || input1Data.data.coordinates, input2Data.data.coords || input2Data.data.coordinates, 2)}\`Ly.`);
};

// helper function to know if any data is present
function checkForMissingData(data) {
	// if length is 0, return false
	if (data.length === 0) return true;

	// if no system name nor a cmdr valid response
	if (!data.name && data.msgnum !== 100) return true;

	// if no url but valid user data
	if (data.msgnum === 100 && !data.url) return true;

	// otherwise return false
	return false;
}

exports.config = {
	guildOnly: true,
	aliases: ["dist"],
	permLevel: "User",
	name: "distance",
	description: "Calculates distance between two systems, a CMDR and a system, or two CMDRs",
	usage: ["[<system 1/CMDR 1>], [<system 2/CMDR 2>]"]
};
