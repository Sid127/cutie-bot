exports.run = (client, message, [mention, ...reason]) => {
  const { Client, MessageEmbed } = require('discord.js');
  if (!message.member.roles.cache.some(r=>["staff", "aide", "admin"].includes(r.name)))
    return message.reply("you can't use this command.");

  const header = `This bot is a homebrew bot and is being made by one (1) person as a community project/hobby. Support for the bot is NOT guaranteed.

Its current prefix is "qt"

***Current Command List:***`

  const embed = new MessageEmbed()
    .setTitle("**__CUTIE__**")
    .setColor(0xffd1dc)
    .setDescription(`
${header}

**kick**
**ban**
**mute**
**unmute**
**clear** - make sure you include the command message as a message to be deleted too
**give** - give a user points
**takeaway** - remove points from a user
**cleanup** - remove leaderboard data of users that haven't been active in a month

I believe these commands are pretty self explanatory :)`);
    message.channel.send(embed);
}