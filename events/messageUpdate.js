module.exports = (client, oldMessage, newMessage) => {
	const { MessageEmbed } = require("discord.js");
	const moment = require("moment-timezone");
	actionDate = moment(Date.now()).format('hh:mm DD/MM/YYYY')

  if (oldMessage.partial) return;
	if (oldMessage.content === null) return;
	if (oldMessage.embeds[0] != null) return;
	if (oldMessage.content === newMessage.content) return;

	const key = `${oldMessage.guild.id}`
	const embed = new MessageEmbed()
		.setColor(0xffd1dc)
		.setTitle(`Message updated in #${oldMessage.channel.name}`)
		.addField(`Message Author`, `${oldMessage.author}`)
		.addField(`Old Message`, oldMessage.content)
		.addField(`New Message`, newMessage.content)
		.setTimestamp(`${actionDate}`)

	if (!client.logger.has(key) return;
	const sendChnl = client.logger.get(key, "logChnl")
	client.channels.cache.get(sendChnl).send(embed)
}
