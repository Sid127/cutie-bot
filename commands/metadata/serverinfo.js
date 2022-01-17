exports.run = async (client, message) => {
	const Discord = require("discord.js");
	const moment = require("moment-timezone");

	let author = await message.guild.fetchOwner()

	let embed = new Discord.MessageEmbed()
            .setColor("RANDOM")
            .setThumbnail(`${message.guild.icon != null ? message.guild.iconURL() : "https://discordapp.com/assets/dd4dbc0016779df1378e7812eabaa04d.png"}`)
			.setAuthor(message.guild)
            .addField("Owner", `${author}`)
            .addField("Member Count", `${message.guild.memberCount}`, true)
            .addField("Emoji Count", `${message.guild.emojis.cache.size}`, true)
            .addField("Roles Count", `${message.guild.roles.cache.size}`, true)
			.addField("Text Channels", `${message.guild.channels.cache.filter((c) => c.type === "GUILD_TEXT").size}`, true)
			.addField("Voice Channels", `${message.guild.channels.cache.filter((c) => c.type === "GUILD_VOICE").size}`, true)
			.addField("Created On", `<t:${moment(message.guild.createdAt).unix()}>, <t:${moment(message.guild.createdAt).unix()}:R>`, true)


	message.channel.send({embeds:[embed]});
}

exports.config = {
	guildOnly: true,
	aliases: ["server"],
	permLevel: "User",
	name: "serverinfo",
	description: "Get server info",
	usage: []
};
