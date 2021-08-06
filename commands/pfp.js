exports.run = async(client, message, args, level) => {
	if (!args || args.length < 1)
		return message.channel.send({content:message.author.avatarURL()});
	let member = message.mentions.members.first();
	message.channel.send({content:member.user.avatarURL()});
};

exports.conf = {
	enabled: true,
	guildOnly: true,
	aliases: ["avatar"],
	permLevel: "User"
};

exports.help = {
	name: "pfp",
	category: "Miscellaneous",
	description: "Get a user's profile picture. If no user is mentioned, get yours",
	usage: "pfp <@user>"
};