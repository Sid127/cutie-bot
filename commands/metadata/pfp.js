exports.run = async(client, message, args, level) => {
	if (!args || args.length < 1)
		return message.channel.send({content:message.author.avatarURL()});
	let member = message.mentions.members.first();
	message.channel.send({content:member.user.avatarURL()});
};

exports.config = {
	guildOnly: true,
	aliases: ["avatar"],
	permLevel: "User",
	name: "pfp",
	description: "Get a user's profile picture. If no user is mentioned, get yours",
	usage: ["(<@user>)"]
};