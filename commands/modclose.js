exports.run = (client, message) => {
    const { Client, MessageEmbed } = require('discord.js');
    const closer = require('./close.js');
    if (!message.member.permissions.has('MANAGE_CHANNELS'))
        return message.reply({content:"you can't use this command."});

    if (!message.channel.name.includes("ticket-")) return message.channel.send({content:"You cannot use that here!"})
    message.channel.delete();

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
	permLevel: "Modmin"
};

exports.help = {
	name: "modclose",
	category: "Modmin",
	description: "Closes a ticket channel",
	usage: "modclose"
};