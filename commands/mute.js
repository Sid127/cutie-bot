exports.run = (client, message) => {
    let muteRole = message.guild.roles.cache.find(role => role.name === "Muted");

	if (!muteRole)
		return message.reply(`You'll need to manually set up a "Muted" role for this to work... ask a bot admin for help`)

    if (message.mentions.members.size === 0)
        return message.reply({content:"please mention a user to mute"});

    const muteMember = message.mentions.members.first();

    muteMember.roles.add(muteRole).catch(console.error);
    message.channel.send({content:`Muted.`});
};

exports.config = {
	guildOnly: true,
	aliases: [],
	permLevel: "modAssist",
	name: "mute",
	category: "Modmin",
	description: "Mute a user",
	usage: ["[<@user>]"]
};