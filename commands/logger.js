exports.run = (client, message, args) => {
	const { Client, MessageEmbed } = require('discord.js');

  if(!message.member.hasPermission('ADMINISTRATOR'))
    return message.reply("you can't use this command.");

  let channel = message.mentions.channels.first();
  let loggerChnl = channel.id;

  const key = `${message.guild.id}`
	// Triggers on new servers we haven't seen before.
	client.logger.ensure(`${message.guild.id}`, {
		guild: message.guild.id,
		logChnl: `${loggerChnl}`
	});

	client.logger.set(key, loggerChnl, "logChnl");

	const setChannel = `${client.config.prefix} anon ${key} [message]`
	const embed = new MessageEmbed()
		.setColor(0xffd1dc)
		.setDescription(`Logs channel set to <#${channel.id}>.`)
	message.channel.send(embed)
}
