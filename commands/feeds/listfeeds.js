exports.run = async(client, message, args) => {
	const { Client, EmbedBuilder } = require('discord.js');

	const embed = new EmbedBuilder()
	.setColor(0xffd1dc)
	.setTitle(`List of active feeds`)
	let feeds = await client.serverData.get("feeds")
	for(feed of Object.keys(feeds)) {
		if(Object.keys(feeds[feed]).includes(message.guild.id)){
			embed.addFields([{name: `${feeds[feed].niceName}`, value: `ID: ${feed}\nLatest post: ${feeds[feed]["latest"]}`}])
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