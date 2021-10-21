exports.run = (client, message, args) => {
    if (!message.channel.name.includes("ticket-")) return message.channel.send({content:"You cannot use that here!"})

    let staffRole = message.guild.roles.cache.filter(role => role.permissions.has("VIEW_AUDIT_LOGS"));

    //allow a mod command to permanently close the ticket
    if (message.member.permissions.has("VIEW_AUDIT_LOGS")) {
        if (args === "mod"){
            message.channel.delete();

            const logChannel = message.guild.channels.cache.find(channel => channel.name === "ticket-logs").id;

            //create the logging channel if it doesn't exists
            if (!logChannel) {
                message.guild.channels.create(`ticket-logs`, {type: "text"}).then(channel => {
                    logChannel=channel
                    channel.overwritePermissions([{
                        id: message.guild.id,
                        deny: ["VIEW_CHANNEL", "SEND_MESSAGES"]
                    }])
                })
            }

            //log the close
            const embed = new MessageEmbed()
                .setTitle("**Ticket Closed**")
                .setColor(0xffd1dc)
                .setDescription(`\n**Ticket: ${message.channel.name}**\n\nVerified by: <@${message.author.id}>`)
            client.channels.cache.get(logChannel).send({embeds:[embed]});
        }
    }

    //update ticket channel permissions
    message.channel.overwritePermissions([{
        id: message.guild.id,
        deny: ["VIEW_CHANNEL", "SEND_MESSAGES"]
    }])

    for (r of staffRole){
        message.channel.overwritePermissions([{
            id: r.id,
            allow: ["VIEW_CHANNEL", "SEND_MESSAGES"]
        }]);
    }
    message.channel.send({content:`This channel has been archived for staff to check for any rule-breaking. Once it has been checked, the staff is expected to manually close the channel using ${client.config.prefix}close mod`})
}

exports.conf = {
	enabled: true,
	guildOnly: false,
	aliases: [],
	permLevel: "User"
};

exports.help = {
	name: "close",
	category: "Miscellaneous",
	description: "Closes a ticket channel",
	usage: "close"
};