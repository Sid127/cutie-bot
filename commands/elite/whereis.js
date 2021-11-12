// module requires
var moment = require("moment");
const { Formatters } = require("discord.js");

// our own api caller file and helper functions
const { asyncEDSM } = require("../../functionFiles/APICalls.js");
const { distanceCalc } = require("../../functionFiles/helperFunctions.js");

exports.run = async(client, message, args) => { // eslint-disable-line no-unused-vars

	// check if arguments is empty, in that case return with an "problem" message
	if (args.trim().length === 0) {
		return message.reply("Looks like I didn't get any input agruments.");
	}

	// add in vars for cmdr name and possible reference system, comma separated
	let [cmdrName, ...refSystem] = args.split(",").map(elem => elem.trim());

	// do send a temp message to tell something's going on, and do an EDSM api call to get commander data and home system data
	let tempMessage = await message.channel.send("Retrieving data...");
	let cmdrData = await asyncEDSM("/api-logs-v1/get-position", {"showCoordinates": 1, "commanderName": cmdrName});
	let homeSysData = await asyncEDSM("/api-v1/system", {"showCoordinates": 1, "systemName": client.cache[message.guild.id].homeSys || "Sol"});

	// check if commander API call message status ok
	if (cmdrData.status === "ok") {
		// use switch for ease of checking multiple codes
		switch (cmdrData.data.msgnum) {
			case 100: {	// everything is ok, returned data from EDSM
				// check if system details is in the response
				if (cmdrData.data.system) {
					// do distance calculation to what homeSysData.data has, if not, do Sol at [0, 0, 0]
					let distance = distanceCalc(cmdrData.data.coordinates, homeSysData.data ? homeSysData.data.coords : {x: 0, y: 0, z: 0}, 2);

					// add in a variable to hold refSystem API call data, if not empty array
					let refSystemData = {};
					if (refSystem.length !== 0) {
						refSystemData = await asyncEDSM("/api-v1/system", {"showCoordinates": 1, "systemName": refSystem.join(", ")});

						// check if we have any data, at which point do the distance calc
						if (refSystemData.data.length !== 0) {
							refSystemData.data.distance = distanceCalc(cmdrData.data.coordinates, refSystemData.data.coords, 2);
						}
					}

					// message with the data to respond with
					let dataRes = `== CMDR ${cmdrData.data.url.split("/").pop().replace(/\+/g, " ")}, Home: ${homeSysData.data ? homeSysData.data.name : "Sol"} ==\n` +
						`Last Seen     :: ${cmdrData.data.system}\n` +
						`When          :: ${cmdrData.data.date ? cmdrData.data.date : "Heck if I know.."}\n` +
						`In Ship       :: ${cmdrData.data.shipType ? cmdrData.data.shipType : "How are you flying without a ship..?"}\n` +
						`Distance Home :: ${distance} ly`

					// check if reference system data was got, if so add in either refSystem name and distance or if no data found, say so
					if (refSystemData.data && refSystemData.data.length !== 0) {
						dataRes += `\n\nReference system :: ${refSystemData.data.name}\n` +
							`Distance to ref  :: ${refSystemData.data.distance ? `${refSystemData.data.distance} ly (from current location)` : "I don't know?"}`
					} else if (refSystemData.data && refSystemData.data.length === 0) {
						dataRes += `\n\n * No data about reference (${refSystem}) system found *`
					}

					tempMessage.edit(Formatters.codeBlock('asciidoc', dataRes));
				} else { // .data.systems is missing, so most likely profile is private
					tempMessage.edit(`Looks like CMDR \`${cmdrName.replace(/\`/g, "")}\` has their EDSM profile set to "Private"`);
				}
				break;
			}
			case 201: {	// missing commander name status code
				tempMessage.edit("Missing CMDR name.");
				break;
			}
			case 203: {	// no commander with said name found
				tempMessage.edit(`CMDR by the name \`${cmdrName.replace(/\`/g, "")}\` not found.`);
				break;
			}
			default: {
				tempMessage.edit("Wait, how did you get here? Please let my devs know...");
				break;
			}
		}
	} else {	// if API's had some issues, let the user know
		tempMessage.edit(`Issues retrieving CMDR data. ${cmdrData.statusCode}`);
	}
};

exports.config = {
	guildOnly: true,
	aliases: [],
	permLevel: "User",
	name: "whereis",
	description: "Last Known Location of a Commander",
	usage: [`[<commander name>], (<reference system name>)`]
};
