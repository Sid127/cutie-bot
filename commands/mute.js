exports.run = (client, message, [mention, ...reason]) => {
    let muteRole = message.guild.roles.cache.find(role => role.name === "Muted");

    if (message.mentions.members.size === 0)
        return message.reply({content:"please mention a user to mute"});

    const muteMember = message.mentions.members.first();

    muteMember.roles.add(muteRole).catch(console.error);
    message.channel.send({content:`Muted.`});
};

exports.conf = {
	enabled: true,
	guildOnly: true,
	aliases: [],
	permLevel: "modAssist"
};

exports.help = {
	name: "mute",
	category: "Modmin",
	description: "Mute a user",
	usage: "mute [@user]"
};