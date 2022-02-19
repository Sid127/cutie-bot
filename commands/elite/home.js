// module requires
const { Client, MessageEmbed } = require('discord.js');

exports.run = async(client, message) => {
    //grab data from mongo and check if we have a home system set
	let homeInfo = await client.serverData.get(`${message.guild.id}.home`);
	if (homeInfo.system === null) return message.channel.send("You know you have to set that up first, right?");

	// create and populate the embed
    let embed = new MessageEmbed()
        .setTitle(`${homeInfo.faction ? `'${homeInfo.faction}' in ` : ""}'${homeInfo.system}'${homeInfo.station ? ` at '${homeInfo.station}'` : ""}`)
        .setAuthor(message.guild)
        .setColor('RANDOM');

    //add additional data if found
	for (let [key, value] of Object.entries(homeInfo)) {
		if (!key.match("(system|station|faction)")) {
			embed.addField(`Nearest ${value.fullName}`, `${value.system}, ${value.station}, ${value.distanceToArrival.toFixed(1)} Ls, ${value.distanceHome} Ly`);
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
