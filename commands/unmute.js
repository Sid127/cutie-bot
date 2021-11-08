exports.run = (client, message) => {
    let muteRole = message.guild.roles.cache.find(role => role.name === "Muted");

    if (message.mentions.members.size === 0)
        return message.reply({content:"please mention a user to unmute"});

    const muteMember = message.mentions.members.first();

    muteMember.roles.remove(muteRole).catch(console.error);
    message.channel.send({content:`Unmuted.`});
};

exports.config = {
	guildOnly: true,
	aliases: [],
	permLevel: "modAssist",
	name: "unmute",
	category: "Moderation",
	description: "Unmute a user",
	usage: ["[<@user>]"]
};