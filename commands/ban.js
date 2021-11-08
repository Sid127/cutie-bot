exports.run = (client, message, args) => {
  const moment = require("moment-timezone");
  actionDate = moment().tz('Europe/London').format('DD MMM YYYY hh:mm:ss')

  let [mention, ...reason] = args.split(" ")

  //handle there not being a mentioned member
  if (message.mentions.members.size === 0)
    return message.reply({content:"please mention a user to ban"});

  //handle the bot not having the ban permission
  if (!message.guild.me.permissions.has("BAN_MEMBERS"))
    return message.reply({content:"I don't have the permission for this"});

  //grab offender metadata
  const banMember = message.mentions.members.first();
	const log = message.mentions.users.first().tag;

  //this is the actual ban
  banMember.ban(reason.join(" ")).then(member => {
    message.reply({content:`${member.user.username} was succesfully banned.`});

  //and here we log it, if logging channel is set
  const logChannel = message.guild.channels.cache.find(channel => channel.name === "mod-log").id;
  if (!logChannel) return;
  client.channels.cache.get(logChannel).send(`
**user:** ${log}
**action taken:** ban
**reason for action:** ${reason.join(" ")}
**date/time and timezone:** ${actionDate} GMT`).catch(console.error);
  });
};

exports.config = {
	guildOnly: true,
	aliases: [],
	permLevel: "serverAdmin",
	name: "ban",
	category: "Modmin",
	description: "Bans a user",
	usage: ["[<@user>] (<reason>)"]
};
