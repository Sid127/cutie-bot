exports.run = (client, message) => {
    const { Client, MessageEmbed } = require('discord.js');
    const closer = require('./close.js');

    //make sure this is being used in a ticket channel
    if (!message.channel.name.includes("ticket-")) return message.channel.send({content:"You cannot use that here!"})
    message.channel.delete();

    //log the close
    const logChannel = message.guild.channels.cache.find(channel => channel.name === "ticket-logs").id;
    if (!logChannel) return;
    const embed = new MessageEmbed()
        .setTitle("**Ticket Closed**")
        .setColor(0xffd1dc)
        .setDescription(`
**Ticket: ${message.channel.name}**

Closed by: <@${closer.name}>
Verified by: <@${message.author.id}>`)
    client.channels.cache.get(logChannel).send({embeds:[embed]});
    closer.name = '';
}

exports.conf = {
	enabled: true,
	guildOnly: false,
	aliases: [],
	permLevel: "modAssist"
};

exports.help = {
	name: "modclose",
	category: "Modmin",
	description: "Closes a ticket channel",
	usage: "modclose"
};