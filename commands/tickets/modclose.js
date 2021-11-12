exports.run = async (client, message) => {
    const { Client, MessageEmbed } = require('discord.js');

    if (!message.channel.name.includes("ticket-")) return message.channel.send("You cannot use that here!")
    message.channel.delete();

    let logChannel = message.guild.channels.cache.find(channel => channel.name === "ticket-logs");
    //create the logging channel if it doesn't exists
    if (!logChannel) {
        await message.guild.channels.create(`ticket-logs`, {parent: message.channel.parent.id, type: "text"})
        let logChannel = message.guild.channels.cache.find(channel => channel.name === "ticket-logs");

        logChannel.permissionOverwrites.set([{
            id: message.guild.id,
            deny: [Permissions.FLAGS.VIEW_CHANNEL, Permissions.FLAGS.SEND_MESSAGES]
        }])
    }
    //log the close
    const embed = new MessageEmbed()
        .setTitle("**Ticket Closed**")
        .setColor(0xffd1dc)
        .setDescription(`\n**Ticket: ${message.channel.name}**\nVerified by: <@${message.author.id}>`)
    logChannel.send({embeds: [embed]});   
}
exports.config = {
	guildOnly: false,
	aliases: [],
	permLevel: "modAssist",
	name: "modclose",
	description: "Permanently closes a ticket channel",
	usage: []
};