exports.run = async(client, message, args, level) => { // eslint-disable-line no-unused-vars
	await message.reply({content:"Bot is shutting down."});
	client.commands.forEach(async cmd => {
		await client.unloadCommand(cmd);
	});
	process.exit(1);
};

exports.config = {
	guildOnly: true,
	aliases: [],
	permLevel: "serverAdmin",
	name: "reboot",
	category: "Modmin",
	description: "Reboot the bot",
	usage: []
};