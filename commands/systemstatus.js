// module requires
const { Formatters } = require("discord.js");
const moment = require("moment");

// our own api caller file
const { asyncEBGS } = require("../functionFiles/APICalls.js");
const { capitalizeString } = require("../functionFiles/helperFunctions.js");

exports.run = async(client, message, args) => {
	// check for empty args
	if (args.trim().length === 0) {
		return message.reply("A system to gather data for would be helpful so I can show something.");
	}

	// special tag variable creation and check for special tags as the first thing in the args
	let specialTag = "";
	if (args.toLowerCase().match("(chart|conflicts).*")) {
		[specialTag, ...args] = args.split(" ");

		// clean up special tag and force lower case, also join and then trim args
		specialTag = specialTag.toLowerCase().trim();
		args = args.join(" ").trim();
	}

	// check for empty args
	if (specialTag && args.length === 0) {
		return message.reply("Oh, you gave me a special tag, but still I'd be more helpful if I got a faction name with that still...");
	}

	// send the temp message and do the API call to EBGS for the faction data and the tick data
	let tempMessage = await message.channel.send("Retrieving data...");
	let systemData = await asyncEBGS("/systems", {name: args})
	let tickData = client.cache.tick

	// check if the api call did return some data
	if (!systemData.data || systemData.data.docs.length === 0) {
		return tempMessage.edit(`No data found for \`${args.replace(/\`/g, "")}\`. You sure it's populated and that you spelled it correctly..?`);
	}

	// variable to set moment parsed date value
	let lastTick = tickData ? moment(tickData.time) : undefined
	let updatedWhen = moment(systemData.data.docs[0].updated_at);
	let updatedString = `${updatedWhen.fromNow()}${updatedWhen.isBefore(lastTick) ? " (Stale data)" : ""}`;

	// get the chart for the system
	let systemChart = `http://jegin.net/testchart2.php?sysid=${systemData.data.docs[0].eddb_id}.png`;

	// if we have the chart special tag we want that sent but nothing else
	if (specialTag.match("(chart)")) {
		return tempMessage.edit({content: `Updated: \`${updatedString}\``,
			files: [{
				attachment: systemChart,
				name: "file.png"
			}]
		});
	}

	// variable creation for the output text
	let outputData = "";

	// check if no special tag, at which point get all faction data etc...
	if (!specialTag) {
		// since we're this far, get the data for all the factions in the system
		let factionDataArr = await Promise.all(
			systemData.data.docs[0].factions.map(faction => asyncEBGS("/factions", {name: faction.name}))
		);

		// loop through all factions and get the data from them that's wanted
		for (let faction of factionDataArr) {
			// find the system specific data for the faction we're on
			let factionSystemData = faction.data.docs[0].faction_presence.find(system => system.system_name === systemData.data.docs[0].name);

			// if no special tag, just gather the default stuff
			outputData += `\n== ${faction.data.docs[0].name} == ${systemData.data.docs[0].controlling_minor_faction_cased === faction.data.docs[0].name ? "*CONTROLLING FACTION*" : ""}\n` +
				`Influence  :: ${(factionSystemData.influence * 100).toFixed(2)}%\n` +
				`State      :: ${capitalizeString(factionSystemData.state)}\n` +
				`${factionSystemData.pending_states.length === 0 ? "" : `Pending    :: ${factionSystemData.pending_states.map(elem => capitalizeString(elem.state)).join(" ")}\n`}` +
				`${factionSystemData.recovering_states.length === 0 ? "" : `Recovering :: ${factionSystemData.recovering_states.map(elem => capitalizeString(elem.state)).join(" ")}\n`}`

		}
	}

	// check if conflicts special tag first
	if (specialTag.match("(conflicts)")) {
		// then check if there are any, if not, else out a message with explanation
		if (systemData.data.docs[0].conflicts.length > 0) {
			// loop through all the conflicts
			for (let conflict of systemData.data.docs[0].conflicts) {
				outputData += `\n== A: ${conflict.faction1.name} *VS* B: ${conflict.faction2.name} ==\n` +
					`Type     :: ${capitalizeString(conflict.type)} (${conflict.status ? capitalizeString(conflict.status) : "What? A status? I don't know"})\n` +
					`A. Stake :: ${conflict.faction1.stake === "" ? "Nothing" : conflict.faction1.stake}\n` +
					`A. Wins  :: ${conflict.faction1.days_won}\n` +
					`B. Stake :: ${conflict.faction2.stake === "" ? "Nothing" : conflict.faction2.stake}\n` +
					`B. Wins  :: ${conflict.faction2.days_won}\n`
			}
		} else {
			outputData += `No conflicts found in :: ${systemData.data.docs[0].name}\n`
		}
	}

	// add when updated to the end of the message
	outputData += `\nUpdated :: ${updatedString}`

	// send the message
	tempMessage.edit({
		content: Formatters.codeBlock("asciidoc", outputData.trim()),
		files: !specialTag ? [{ attachment: systemChart, name: "file.png" }] : []
	});
};

exports.config = {
	guildOnly: true,
	aliases: ["ss"],
	permLevel: "User",
	name: "systemstatus",
	category: "Elite",
	description: "Gives the BGS update of the Factions in a System",
	usage: ["(chart || conflicts) [<system>]"]
};
