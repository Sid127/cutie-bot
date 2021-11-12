exports.run = async (client, message, args) => {
    const { Permissions, MessageEmbed } = require("discord.js")
    if (!message.channel.name.includes("ticket-")) return message.channel.send({content:"You cannot use that here!"})

    //update ticket channel permissions
    message.channel.permissionOverwrites.set([{
        id: message.guild.id,
        deny: [Permissions.FLAGS.VIEW_CHANNEL, Permissions.FLAGS.SEND_MESSAGES]
    }])

    message.channel.send({content:`This channel has been archived for staff to check for any rule-breaking. Once it has been checked, the staff is expected to manually close the channel using \`${client.prefix}modclose\``})
}

exports.config = {
	guildOnly: false,
	aliases: [],
	permLevel: "User",
	name: "close",
	description: "Closes a ticket channel",
	usage: []
};