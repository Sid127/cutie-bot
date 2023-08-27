exports.run = async (client, message) => {
    const { Client, EmbedBuilder } = require('discord.js');

    if (!message.channel.name.includes("ticket-")) return message.channel.send("You cannot use that here!")
	const embed = new EmbedBuilder()
		.setTitle("**Ticket Closed**")
		.setColor(0xffd1dc)
		.setDescription(`\n**Ticket: ${message.channel.name}**\nVerified by: <@${message.author.id}>`)

	//determine which channel to log to
	let logChnl = await client.serverData.get(`${message.guild.id}.ticLog`)
	if(logChnl === null) {logChnl = await client.serverData.get(`${message.guild.id}.logChnl`)}
	if(!logChnl){
    	let logChannel = message.guild.channels.cache.get(logChnl);

    	//log the close
    	logChannel.send({embeds: [embed]});
	}

	//close the channel
	message.channel.delete();
}
exports.config = {
	guildOnly: false,
	aliases: [],
	permLevel: "modAssist",
	name: "modclose",
	description: "Permanently closes a ticket channel",
	usage: []
};
