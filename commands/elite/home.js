// module requires
const { Client, EmbedBuilder } = require('discord.js');

exports.run = async(client, message) => {
    //grab data from mongo and check if we have a home system set
	let homeInfo = await client.serverData.get(`${message.guild.id}.home`);
	if (homeInfo.system === null) return message.channel.send("You know this has to be set up first, right?");

	// create and populate the embed
    let embed = new EmbedBuilder()
        .setAuthor({name: message.guild.name, iconURL: message.guild.iconURL()})
        .setColor('Random')
		.setFields([{
			name: "**Home Data:**",
			value: `**System:** ${homeInfo.system ? `[${homeInfo.system}](${(homeInfo.system && homeInfo.systemID) ? encodeURI(`https://www.edsm.net/en/system/id/${homeInfo.systemID}/name/${homeInfo.system}`) : ""})` : "Unkown"}\n` +
				`**Station:** ${homeInfo.station ? `[${homeInfo.station}](${(homeInfo.system && homeInfo.systemID && homeInfo.station && homeInfo.stationID) ? encodeURI(`https://www.edsm.net/en/system/stations/id/${homeInfo.systemID}/name/${homeInfo.system}/details/idS/${homeInfo.stationID}/nameS/${homeInfo.station}`) : ""})` : "Unkown"}\n` +
				`**Faction:** ${homeInfo.faction ? `[${homeInfo.faction}](${(homeInfo.faction && homeInfo.factionID) ? encodeURI(`https://www.edsm.net/en/faction/id/${homeInfo.factionID}/name/${homeInfo.faction}`) : ""})` : "Unkown"}`
		}, {
			name: "\u200B", value: "\u200B"
		}])
		.setImage(homeInfo.homeImageURL ? homeInfo.homeImageURL : "")
		.setFooter({text: "All links go to EDSM"});

    //add additional data if found
	for (let [key, value] of Object.entries(homeInfo)) {
		let fieldType;

		// find the keys we want to check against
		if (key.match(/.*trader/gi)) { fieldType = "Nearest Material Traders:"
		} else if (key.match(/.*broker/gi)) { fieldType = "Nearest Tech Brokers:"
		} else if (key.match(/(iFactor|fc.*)/gi)) { fieldType = "Other:" }

		// if we found data we want to have added here, check if that field already is made, if not, add it in
		if (fieldType) {
			let inputString = `**${fieldType === "Other:" ? value.fullName : value.fullName.split(" ")[0]}**: ${value.system}, [${value.station}](${(value.system && value.systemID && value.station && value.stationID) ? encodeURI(`https://edsm.net/en/system/stations/id/${value.systemID}/name/${value.system}/details/idS/${value.stationID}/nameS/${value.station}`) : ""}), ${value.distanceToArrival.toFixed(1)} Ls, ${value.distanceHome} Ly`

			let foundFieldIndex = embed.fields.findIndex(elem => elem.name.includes(fieldType));
			foundFieldIndex === -1 ? embed.addField(fieldType, inputString) : embed.fields[foundFieldIndex].value += `\n${inputString}`
		}
	}

	message.channel.send({embeds:[embed]});
};

exports.config = {
	guildOnly: true,
	aliases: ["homes"],
	permLevel: "User",
	name: "home",
	description: "Shows Home System Information",
	usage: []
};
