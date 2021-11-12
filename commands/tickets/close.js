exports.run = async (client, message, args) => {
    const { Permissions, MessageEmbed } = require("discord.js")
    if (!message.channel.name.includes("ticket-")) return message.channel.send({content:"You cannot use that here!"})

    //allow a mod command to permanently close the ticket
    if (message.member.permissions.has("VIEW_AUDIT_LOG")) {
        if (args === "mod"){
            let logChannel = message.guild.channels.cache.find(channel => channel.name === "ticket-logs");

            //create the logging channel if it doesn't exists
            if (!logChannel) {
                await message.guild.channels.create(`ticket-logs`, {parent: message.channel.parent.id, type: "text"})
                let logChannel = message.guild.channels.cache.find(channel => channel.name === "ticket-logs");

                logChannel.permissionOverwrites.set([{
                    id: message.guild.id,
                    deny: [Permissions.FLAGS.VIEW_CHANNEL, Permissions.FLAGS.SEND_MESSAGES]
                }])

                //log the close
                const embed = new MessageEmbed()
                    .setTitle("**Ticket Closed**")
                    .setColor(0xffd1dc)
                    .setDescription(`\n**Ticket: ${message.channel.name}**\n\nVerified by: <@${message.author.id}>`)
                logChannel.send({embeds:[embed]});
                message.channel.delete();
            }
        } else {
            //update ticket channel permissions
            message.channel.permissionOverwrites.set([{
                id: message.guild.id,
                deny: [Permissions.FLAGS.VIEW_CHANNEL, Permissions.FLAGS.SEND_MESSAGES]
            }])

            message.channel.send({content:`This channel has been archived for staff to check for any rule-breaking. Once it has been checked, the staff is expected to manually close the channel using ${client.prefix}close mod`})
        }
    }
}

exports.config = {
	guildOnly: false,
	aliases: [],
	permLevel: "User",
	name: "close",
	description: "Closes a ticket channel",
	usage: []
};