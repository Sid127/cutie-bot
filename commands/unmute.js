exports.run = (client, message, [mention, ...reason]) => {
    let muteRole = message.guild.roles.cache.find(role => role.name === "Muted");

    if (message.mentions.members.size === 0)
        return message.reply({content:"please mention a user to unmute"});

    const muteMember = message.mentions.members.first();

    muteMember.roles.remove(muteRole).catch(console.error);
    message.channel.send({content:`Unmuted.`});
};

exports.conf = {
	enabled: true,
	guildOnly: true,
	aliases: [],
	permLevel: "modAssist"
};

exports.help = {
	name: "unmute",
	category: "Modmin",
	description: "Unmute a user",
	usage: "unmute [@user]"
};