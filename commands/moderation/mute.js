exports.run = (client, message, args) => {

    if (message.mentions.members.size === 0)
        return message.reply({content:"please mention a user to mute"});

    const muteMember = message.mentions.members.first();

	//prevent self-moderation
	if (muteMember.permissions.has('ViewAuditLog') || muteMember.permissions.has('Administrator')) return message.channel.send("I'm not muting them! They're powerful D:")

	//apply timeout
    muteMember.timeout(604800000, args).catch(console.error);
	client.users.cache.get(muteMember.id).send("You've been put on a timeout! Use my modmail feature (if set up) or contact a moderator to settle this.")
    message.channel.send({content:`Muted for a week, don't forget to unmute!`});
};

exports.config = {
	guildOnly: true,
	aliases: ["timeout"],
	permLevel: "modAssist",
	name: "mute",
	description: "Timeout a user",
	usage: ["[<@user>] (reason)"]
};
