// our own API caller and helper files
const { AxiosEDSM } = require("../../functionFiles/APICalls.js");
const { distanceCalc } = require("../../functionFiles/helperFunctions.js");

exports.run = async(client, message, args) => {
	// check for empty args
	if (args.trim().length === 0) {
		return message.reply("I'd like two comma separated inputs, please.");
	}

	// split out systems and other data
	const [input1 = "", input2 = ""] = args.split(", ").map(elem => elem.trim());

	// check if either system is empty, if so, reply about it
	if (input1 === "" || input2 === "") {
		return message.reply("Two inputs separated by a comma would be nice.");
	}

	// send temp message
	let tempMessage = await message.channel.send("Retrieving data...");

	// get guild home data
	let homeInfo = await client.serverData.get(`${message.guild.id}.home`);

	// create API calls, and set them in a promise.all() to wait for everything to come back
	// ternaries for checking if a cmdr data or a system was given
	let [input1Data, input2Data] = await Promise.all([
		(input1.toLowerCase().startsWith("cmdr")
			? AxiosEDSM("/api-logs-v1/get-position", {showCoordinates: 1, commanderName: input1.slice(4).trim()})
			: AxiosEDSM("/api-v1/system", {showCoordinates: 1, systemName: (input1.toLowerCase() === "home" ? homeInfo.system : input1)})),

		(input2.toLowerCase().startsWith("cmdr")
			? AxiosEDSM("/api-logs-v1/get-position", {showCoordinates: 1, commanderName: input2.slice(4).trim()})
			: AxiosEDSM("/api-v1/system", {showCoordinates: 1, systemName: (input2.toLowerCase() === "home" ? homeInfo.system : input2)}))
	]);

	// check for validity of the data got back
	if (checkForMissingData(input1Data) || checkForMissingData(input2Data)) {
		return tempMessage.edit(`Couldn't find data about ` +
		`\`${((!input1Data.name && !input1Data.url) && (!input2Data.name && !input2Data.url))
			? `${input1.replace(/\`/g, "")}\` nor \`${input2.replace(/\`/g, "")}`
			: ((!input1Data.name && !input1Data.url) ? input1.replace(/\`/g, "") : input2.replace(/\`/g, ""))}\`.\n` +
		`Please check your spelling... Or that EDSM has the data.`);
	}

	// if we're this far in, we should have the data, do distance calculation and edit temp message
	tempMessage.edit(`Distance between ` +
		`\`${input1Data.name || `CMDR ` + input1Data.url.split("/").pop().replace(/\+/g, " ") + ` (` + input1Data.system + `)`}\` and ` +
		`\`${input2Data.name || `CMDR ` + input2Data.url.split("/").pop().replace(/\+/g, " ") + ` (` + input2Data.system + `)`}\` is ` +
		`\`${distanceCalc(input1Data.coords || input1Data.coordinates, input2Data.coords || input2Data.coordinates, 2)}\`Ly.`);
};

// helper function to know if any data is present
function checkForMissingData(data) {
	// if there is no data, return true
	if (!data) return true;

	// if length is 0, return true
	if (data.length === 0) return true;

	// if no system name nor a cmdr valid response
	if (!data.name && data.msgnum !== 100) return true;

	// if no url but valid user data
	if (data.msgnum === 100 && !data.url) return true;

	// otherwise return false
	return false;
}

exports.config = {
	guildOnly: false,
	aliases: ["dist"],
	permLevel: "User",
	name: "distance",
	description: "Calculates distance between two systems, a CMDR and a system, or two CMDRs",
	usage: ["[<system 1/CMDR 1>], [<system 2/CMDR 2>]"]
};
