exports.run = (client, message, [param, ...announcement]) => {
  const { Client, MessageEmbed } = require('discord.js');

  if(!message.member.permissions.has('ADMINISTRATOR'))
    return message.reply({content:"you can't use this command."});

  if (param === "everyone"){
    let channel = message.mentions.channels.first();
    var announce = announcement.join(" ")
    var space = announce.indexOf(' ')
    var msg = announce.slice(space, announce.length)
    const embed = new MessageEmbed()
      .setColor(0xffd1dc)
      .setDescription(`${msg}`)
      .setTimestamp();

    message.guild.channels.cache.get(channel.id).send({content: `@everyone`, embeds: [embed]})
  } else {
    const embed = new MessageEmbed()
      .setColor(0xffd1dc)
      .setDescription(`${announcement.join(" ")}`)
      .setTimestamp();
    let channel = message.mentions.channels.first();
    message.guild.channels.cache.get(channel.id).send({embeds: [embed]})
  }
}

exports.conf = {
	enabled: true,
	guildOnly: true,
	aliases: ["megaphone", "decree"],
	permLevel: "Modmin"
};

exports.help = {
	name: "announce",
	category: "Modmin",
	description: "Sends an announcement to a specified channel",
	usage: "announce <@everyone> [#channel] [announcement]"
};