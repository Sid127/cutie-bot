exports.run = (client, message) => {

//to-do
//rework this whole command to not have hardcoded role names

    let staffRole = message.guild.roles.cache.find(role => role.name === "staff").id;

    if (!message.channel.name.includes("ticket-")) return message.channel.send({content:"You cannot use that here!"})
    message.channel.overwritePermissions([{
            id: message.guild.id,
            deny: ["VIEW_CHANNEL", "SEND_MESSAGES"]
        },
        {
            id: staffRole,
            allow: ["VIEW_CHANNEL", "SEND_MESSAGES"]
        }
    ]);
    message.channel.send({content:`This channel has been archived for staff to check for any rule-breaking. Once it has been checked, the staff is expected to manually close the channel using ${client.config.prefix}modclose`})
    var name = message.author.id;
    exports.name = name;
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