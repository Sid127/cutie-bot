exports.run = (message, [param, ...announcement]) => {
  const { Client, MessageEmbed } = require('discord.js');

  // Check to see if the command is in the form of "announce everyone #channel announcement" similar to Dyno's announce command
  if (param === "everyone"){
    // Remove the "everyone" text from the [param, ...announcement] arguments
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
	permLevel: "serverAdmin"
};

exports.help = {
	name: "announce",
	category: "Modmin",
	description: "Sends an announcement to a specified channel",
	usage: "announce <@everyone> [#channel] [announcement]"
};