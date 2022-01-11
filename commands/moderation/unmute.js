exports.run = (client, message, args) => {

    if (message.mentions.members.size === 0)
        return message.reply({content:"please mention a user to unmute"});

    const muteMember = message.mentions.members.first();

	//remove the timeout
    muteMember.timeout(null, args).catch(console.error);
    message.channel.send({content:`Unmuted.`});
};

exports.config = {
	guildOnly: true,
	aliases: ["untimeout"],
	permLevel: "modAssist",
	name: "unmute",
	description: "Unmute a user",
	usage: ["[<@user>]"]
};
