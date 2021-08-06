exports.run = async(client, message, args) => {
    const moment = require("moment-timezone");
    require("moment-duration-format");


    if (!args[0]) return message.channel.send({content:"Find your timezone here <https://xske.github.io/tz/> and tell me it by passing the command `qt bd-zone timezone`. Example: `qt bd-zone Asia/Calcutta"});
    let timezone = args[0]

    if (timezone.includes('/')) {
        await client.birthdays.set(`${message.guild.id}-${message.author.id}.timezone`, timezone)
        message.channel.send({content:"Added your timezone to my records"})
    } else {
        return message.channel.send({content:"Invalid timezone format :("})
    }
}

exports.conf = {
	enabled: true,
	guildOnly: true,
	aliases: [],
    permLevel: "User"
};

exports.help = {
	name: "bd-zone",
	category: "Birthdays",
	description: "Add/change your recorded timezone",
	usage: "bd-zone [tz-database timezone]\nExample: bd-zone Asia/Calcutta"
};