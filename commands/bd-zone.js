exports.run = async(client, message, args) => {
    const moment = require("moment-timezone");
    require("moment-duration-format");

    //help with usage if a timezone isn't given
    if(args.trim().length === 0) return message.channel.send({content:"Find your timezone here <https://xske.github.io/tz/> and tell me it by passing the command `bd-zone timezone`. Example: `bd-zone Asia/Calcutta"});

    //to-do
    //make this timezone check proper to make sure it complies with the tz-database
    if (args.includes('/')) {
        await client.peopleData.set(`${message.guild.id}-${message.author.id}.timezone`, args)
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