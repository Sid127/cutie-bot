exports.run = (client, message, args) => {
	message.channel.send(`You spoiler a post like this\`||example||\` (which becomes ||example||)\n` +
		`Please add the relevant trigger warning outside of the spoilers as well, so people can avoid any specific trigger(s).`);
}

exports.config = {
	guildOnly: true,
	aliases: [],
	permLevel: "User",
	name: "spoilers",
	category: "Miscellaneous",
	description: "Teach a user how to use spoilers",
	usage: []
};
