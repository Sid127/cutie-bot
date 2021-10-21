exports.run = async(client, message, args) => {
    const moment = require("moment-timezone");
    require("moment-duration-format");

    //help with usage if a timezone isn't given
    if(args.trim().length === 0) return message.channel.send({content:"Find your timezone here <https://xske.github.io/tz/> and tell me it by passing the command `bd-zone timezone`. Example: `bd-zone Asia/Calcutta"});

    //check validity of timezone before adding to mongo
    if (moment.tz.zone(args)) {
        await client.peopleData.set(`${message.guild.id}-${message.author.id}.timezone`, args)
        message.channel.send({content:"Added your timezone to my records"})
    } else {
        return message.channel.send({content:"Invalid timezone format :(\nFind your timezone here <https://xske.github.io/tz/>"})
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