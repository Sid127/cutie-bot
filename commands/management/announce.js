exports.run = (client, message, args) => {
  const { Client, EmbedBuilder } = require('discord.js');

  let [param, ...announcement] = args.split(" ")
 
  // Check to see if the command is in the form of "announce everyone #channel announcement" similar to Dyno's announce command
  if (param === "everyone"){
    // Remove the "everyone" text from the [param, ...announcement] arguments
    let channel = message.mentions.channels.first();
    let announce = announcement.join(" ")
    let space = announce.indexOf(' ')
    let msg = announce.slice(space, announce.length)
    const embed = new EmbedBuilder()
      .setColor(0xffd1dc)
      .setDescription(`${msg}`)
      .setTimestamp();

    message.guild.channels.cache.get(channel.id).send({content: `@everyone`, embeds: [embed]})
  } else {
    const embed = new EmbedBuilder()
      .setColor(0xffd1dc)
      .setDescription(`${announcement.join(" ")}`)
      .setTimestamp();
    let channel = message.mentions.channels.first();
    message.guild.channels.cache.get(channel.id).send({embeds: [embed]})
  }
}

exports.config = {
	guildOnly: true,
	aliases: ["megaphone", "decree"],
	permLevel: "serverAdmin",
	name: "announce",
	description: "Sends an announcement to a specified channel",
	usage: [`("everyone") [<#channel>] [<announcement>]`]
};