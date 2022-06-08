exports.run = async(client, message, args) => {
    const moment = require("moment-timezone");

    //help with usage if a timezone isn't given
    if(args.trim().length === 0) return message.channel.send({content:"Find your timezone here <https://xske.github.io/tz/> and tell me it by passing the command `bd-zone timezone`. Example: `bd-zone Asia/Calcutta`"});

    //check validity of timezone before adding to mongo
    if (moment.tz.zone(args)) {
        await client.peopleData.set(`${message.author.id}.timezone`, args)
        message.channel.send({content:"Added your timezone to my records"})
    } else {
        return message.channel.send({content:"Invalid timezone format :(\nFind your timezone here <https://xske.github.io/tz/>"})
    }
}

exports.config = {
	guildOnly: true,
	aliases: [],
    permLevel: "User",
	name: "bd-zone",
	description: "Add/change your recorded timezone",
	usage: ["[<tz-database timezone>]"]
};
