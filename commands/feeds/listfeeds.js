exports.run = async(client, message, args) => {
	const { Client, MessageEmbed } = require('discord.js');

	const embed = new MessageEmbed()
	.setColor(0xffd1dc)
	.setTitle(`List of active feeds`)
	let feeds = await client.serverData.get("feeds")
	for(feed of Object.keys(feeds)) {
		if(Object.keys(feeds[feed]).includes(message.guild.id)){
			embed.addField(`${feeds[feed].niceName}`, `ID: ${feed}\nLatest post: ${feeds[feed]["latest"]}`)
		}
	}

	message.channel.send({embeds: [embed]})
}

exports.config = {
	guildOnly: true,
	aliases: [],
	permLevel: "modAssist",
	name: "listfeeds",
	description: "List active RSS feeds",
	usage: []
};