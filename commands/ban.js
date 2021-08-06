exports.run = (client, message, [mention, ...reason]) => {
  const moment = require("moment-timezone");
  actionDate = moment().tz('Europe/London').format('DD MMM YYYY hh:mm:ss')

  if(!message.member.permissions.has('BAN_MEMBERS'))
    return message.reply({content:"you can't use this command."});

  if (message.mentions.members.size === 0)
    return message.reply({content:"please mention a user to ban"});

  if (!message.guild.me.permissions.has("BAN_MEMBERS"))
    return message.reply({content:"I don't have the permission for this"});

  const banMember = message.mentions.members.first();
	const log = message.mentions.users.first().tag;

  banMember.ban({reason: reason.join(" ")}).then(member => {
    message.reply({content:`${member.user.username} was succesfully banned.`});

  const logChannel = message.guild.channels.cache.find(channel => channel.name === "mod-log").id;
  if (!logChannel) return;
  client.channels.cache.get(logChannel).send(`
**user:** ${log}
**action taken:** ban
**reason for action:** ${reason.join(" ")}
**date/time and timezone:** ${actionDate} GMT`).catch(console.error);
  });
};

exports.conf = {
	enabled: true,
	guildOnly: true,
	aliases: [],
	permLevel: "Modmin"
};

exports.help = {
	name: "ban",
	category: "Modmin",
	description: "Bans a user",
	usage: "ban [@user] <reason>"
};
