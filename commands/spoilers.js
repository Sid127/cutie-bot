exports.run = (client, message, args) => {
  message.channel.send({content:"You spoiler a post like this \|\|example\|\| (which becomes ||example||). Please add the relevant trigger warning outside of the spoilers as well, so people can avoid any specific trigger(s)."});
}

exports.conf = {
	enabled: true,
	guildOnly: true,
	aliases: [],
	permLevel: "User"
};

exports.help = {
	name: "spoilers",
	category: "Miscellaneous",
	description: "Teach a user how to use spoilers",
	usage: "spoilers"
};