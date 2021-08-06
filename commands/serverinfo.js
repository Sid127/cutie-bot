exports.run = async (client, message) => {
	const Discord = require("discord.js");
	const moment = require("moment-timezone");
	require("moment-duration-format");

	let embed = new Discord.MessageEmbed()
            .setColor("RANDOM")
            .setThumbnail(`${message.guild.icon != null ? message.guild.iconURL() : "https://discordapp.com/assets/dd4dbc0016779df1378e7812eabaa04d.png"}`)
			.setAuthor(`${message.guild} (${message.guild.id})`)
            .addField("Owner", `${message.guild.owner}`)
            .addField("Member Count", `${message.guild.memberCount}`, true)
            .addField("Emoji Count", `${message.guild.emojis.cache.size}`, true)
            .addField("Roles Count", `${message.guild.roles.cache.size}`, true)
			.addField("Text Channels", `${message.guild.channels.cache.filter((c) => c.type === "text").size}`, true)
			.addField("Voice Channels", `${message.guild.channels.cache.filter((c) => c.type === "voice").size}`, true)
			.addField("Created On", `${moment.utc(message.guild.createdAt).format("MMMM Do YYYY")}`, true)


	message.channel.send({embeds:[embed]});
}

exports.conf = {
	enabled: true,
	guildOnly: true,
	aliases: ["server"],
	permLevel: "User"
};

exports.help = {
	name: "serverinfo",
	category: "Miscellaneous",
	description: "Get server info",
	usage: "serverinfo"
};