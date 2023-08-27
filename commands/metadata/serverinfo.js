exports.run = async (client, message) => {
	const { EmbedBuilder } = require("discord.js");
	const moment = require("moment-timezone");

	// get the server owner
	let serverOwner = await message.guild.fetchOwner();

// build the embed
	// since v14 changed channel types again, chenc numbers from: https://discord.com/developers/docs/resources/channel#channel-object-channel-types
	let embed = new EmbedBuilder()
		.setColor("Random")
        .setThumbnail(`${message.guild.icon != null ? message.guild.iconURL() : "https://discordapp.com/assets/dd4dbc0016779df1378e7812eabaa04d.png"}`)
		.setAuthor(message.guild)
		.addFields(
			{ name: "Owner", value: `${serverOwner}`},
			{ inline: true, name: "Member Count", value: `${message.guild.memberCount}`},
			{ inline: true, name: "Emoji Count", value: `${message.guild.emojis.cache.size}`},
			{ inline: true, name: "Roles Count", value: `${message.guild.roles.cache.size}`},
			{ inline: true, name: "Text Channels", value: `${message.guild.channels.cache.filter((c) => [0, 5].includes(c.type)).size}`},
			{ inline: true, name: "Voice Channels", value: `${message.guild.channels.cache.filter((c) => [2, 13].includes(c.type)).size}`},
			{ inline: true, name: "Forum Channels", value: `${message.guild.channels.cache.filter((c) => [15].includes(c.type)).size}`},
			{ inline: true, name: "Threads", value: `${message.guild.channels.cache.filter((c) => [10, 11, 12].includes(c.type)).size}`},
			{ inline: true, name: "Created On", value: `<t:${moment(message.guild.createdAt).unix()}>, <t:${moment(message.guild.createdAt).unix()}:R>`},
		)

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
