// module requires
const moment = require("moment");
const { Formatters, Util } = require("discord.js");

// our own API handler file
const { AxiosEBGS } = require("../../functionFiles/APICalls.js");
const { capitalizeString } = require("../../functionFiles/helperFunctions.js");

exports.run = async(client, message, args) => {
	// special tag variable creation and check for special tags as the first thing in the args
	let specialTag = "";
	if (args.toLowerCase().match("(influence|inf|conflicts|updated|stale).*")) {
		[specialTag, ...args] = args.split(" ");

		// clean up special tag and force lower case, also join and then trim args
		specialTag = specialTag.toLowerCase().trim();
		args = args.join(" ").trim();
	}

	// small bit to allow for "home" to be used for data about home system/faction
	if (args.length === 0 || args.toLowerCase() === "home") {
		let homeInfo = await client.serverData.get(`${message.guild.id}.home`);

		if (!homeInfo.faction) {
			return message.reply("I don't know your home faction, please add it via 'setup home' or give me a faction name.");
		}

		args = homeInfo.faction;
	}

	// send the temp message and do the API call to EBGS for the faction data and the tick data
	let tempMessage = await message.channel.send("Retrieving data...");
	let factionData = await AxiosEBGS("/factions", {name: args});
	let tickData = client.cache.tick;

	// variable to set moment parsed date value
	let lastTick = tickData ? moment(tickData.time) : undefined

	// check if the api call did return some data
	if (!factionData || factionData.docs.length === 0) {
		return tempMessage.edit(`No data found for \`${args.replace(/\`/g, "")}\`. Did you write the name correctly..?`);
	}

	// start the output data with some general faction info
	let outputData = `== "${factionData.docs[0].name}" present in: ${factionData.docs[0].faction_presence.length} system${factionData.docs[0].faction_presence.length === 1 ? "" : "s"}. ==\n\n`;

	// loop through the systems the faction is present in
	for (let system of factionData.docs[0].faction_presence) {
		let tempOutput = "";

		// start checking what data we want where and with what special tags
		if (!specialTag || specialTag.match("(inf|influence)")) {
			tempOutput += `Influence   :: ${(system.influence * 100).toFixed(2)}%\n`
		}

		// the default tags to add if no special data wanted
		if (!specialTag) {
			tempOutput += `State       :: ${capitalizeString(system.state)}\n`
			system.active_states.length > 0 ? tempOutput += `Active      :: ${system.active_states.map(elem => capitalizeString(elem.state)).join(", ")}\n` : ""
			system.pending_states.length > 0 ? tempOutput += `Pending     :: ${system.pending_states.map(elem => capitalizeString(elem.state)).join(", ")}\n` : ""
			system.recovering_states.length > 0 ? tempOutput += `Recovering  :: ${system.recovering_states.map(elem => capitalizeString(elem.state)).join(", ")}\n` : ""
		}

		// find conflicts
		if (!specialTag || specialTag.match("(conflicts)")) {
			// check if one or more conflicts
			if (system.conflicts.length > 0) {
				for (let conflict of system.conflicts) {
					// add a small tag to the otherwise pretty cluttered base search
					if (!specialTag) tempOutput += ` * Conflict data *\n`

					tempOutput += `Type     :: ${capitalizeString(conflict.type)} (${conflict.status ? capitalizeString(conflict.status) : "I don't know the status..."})\n` +
					`Enemy    :: ${conflict.opponent_name}\n` +
					`At stake :: ${conflict.stake ? conflict.stake : "Nothing"}\n` +
					`Days won :: ${conflict.days_won}\n`;

					// get the info of the enemy as well
					//if (specialTag) {
					let enemyData = await AxiosEBGS("/factions", {name: conflict.opponent_name});

					// if no enemy data...
					if (enemyData.docs.length === 0) {
						tempOutput += ` * No enemy data *\n`;
					} else {
						// find the system and the conflict
						let enemySystem = enemyData.docs[0].faction_presence.find(elem => elem.system_name === system.system_name);
						if (enemySystem) {
							let enemyConflict = enemySystem.conflicts.find(elem => elem.opponent_name === factionData.docs[0].name);

							tempOutput += ` * Enemy data *\n` +
							`At stake :: ${enemyConflict.stake ? enemyConflict.stake : "Nothing"}\n` +
							`Days won :: ${enemyConflict.days_won}\n`
						}
					}
					//}
				}
			}
		}

		// if tempOutput does have data in it, then we want to add this to outputData
		if (tempOutput.length > 0 || specialTag.match("(updated|stale)")) {
			// get a temp moment parsed thing for updated at
			let tempUpdatedAt = moment(system.updated_at);

			// check if special tag is "stale" and system was updated AFTER last tick
			if (specialTag.match("(stale)") && !tempUpdatedAt.isBefore(lastTick)) { continue; }

			// (at the start is the separator character used) add the system name to the output data first, with the updated tag and if stale data
			outputData += `\u200b\n== ${system.system_name} == ` +
				`Updated: ${tempUpdatedAt.fromNow()}${tempUpdatedAt.isBefore(lastTick) ? " (Stale data)" : ""}` +
				`${specialTag.match("(updated|stale)") ? "" : "\n"}`

			// and after that the rest of the data
			outputData += tempOutput;
		}
	}

	// check if the message has conflicts tag but has no conflicts (aka ends with == on the first line)
	if (specialTag.match("(conflicts)") && outputData.trim().endsWith("==")) {
		outputData += `There seems to be no conflicts for the time being.`
	}

	// check if the message doesn't ends with "(Stale data)" and has the stale tag
	if (specialTag.match("(stale)") && !outputData.endsWith("(Stale data)")) {
		outputData += `All systems up to date, Good job!`;
	}

	// need to do this silly thing...
	let splitOutput = Util.splitMessage(outputData, {maxLength: 1900, char: "\u200b"});
	await tempMessage.edit(Formatters.codeBlock("asciidoc", splitOutput.shift()));
	for (let chunk of splitOutput) {
		await message.channel.send(Formatters.codeBlock("asciidoc", chunk.trim()));
	}
}

exports.config = {
	guildOnly: true,
	aliases: ["fs"],
	permLevel: "User",
	name: "factionstatus",
	description: "Status of a particular faction",
	usage: ["(influence || conflicts || updated || stale) [<faction name>]"]
};
