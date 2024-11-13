exports.run = async (client, message, args) => {
	const { EmbedBuilder } = require("discord.js");
	const moment = require("moment-timezone");

  let server;
  let serverOwner;
  if ((args || args.length >= 1) && client.hardcoded.botAdmin.includes(`${message.author.id}`)){
    server = client.guilds.cache.get(args);
    if (!server)
      return message.reply("Something's wrong here...");
    serverOwner = await client.guilds.cache.get(args).fetchOwner();
  } else {
    server = message.guild;
    serverOwner = await message.guild.fetchOwner();
  }

// build the embed
	// since v14 changed channel types again, chenc numbers from: https://discord.com/developers/docs/resources/channel#channel-object-channel-types
	let embed = new EmbedBuilder()
		.setColor("Random")
        .setThumbnail(`${server.icon != null ? server.iconURL() : "https://discordapp.com/assets/dd4dbc0016779df1378e7812eabaa04d.png"}`)
		.setAuthor(server)
		.addFields(
			{ name: "Owner", value: `${serverOwner.user.username}`},
			{ inline: true, name: "Member Count", value: `${server.memberCount}`},
			{ inline: true, name: "Emoji Count", value: `${server.emojis.cache.size}`},
			{ inline: true, name: "Roles Count", value: `${server.roles.cache.size}`},
			{ inline: true, name: "Text Channels", value: `${server.channels.cache.filter((c) => [0, 5].includes(c.type)).size}`},
			{ inline: true, name: "Voice Channels", value: `${server.channels.cache.filter((c) => [2, 13].includes(c.type)).size}`},
			{ inline: true, name: "Forum Channels", value: `${server.channels.cache.filter((c) => [15].includes(c.type)).size}`},
			{ inline: true, name: "Threads", value: `${server.channels.cache.filter((c) => [10, 11, 12].includes(c.type)).size}`},
			{ inline: true, name: "Created On", value: `<t:${moment(server.createdAt).unix()}>, <t:${moment(server.createdAt).unix()}:R>`},
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
