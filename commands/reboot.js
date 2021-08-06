exports.run = async(client, message, args, level) => { // eslint-disable-line no-unused-vars
	if(!message.member.permissions.has('ADMINISTRATOR'))
    return;
	await message.reply({content:"Bot is shutting down."});
	client.commands.forEach(async cmd => {
		await client.unloadCommand(cmd);
	});
	process.exit(1);
};

exports.conf = {
	enabled: true,
	guildOnly: true,
	aliases: [],
	permLevel: "Modmin"
};

exports.help = {
	name: "reboot",
	category: "Modmin",
	description: "Reboot the bot",
	usage: "reboot"
};