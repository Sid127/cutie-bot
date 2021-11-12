exports.run = (client, message, args) => {
  const moment = require("moment-timezone");
  actionDate = moment().tz('Europe/London').format('DD MMM YYYY hh:mm:ss')

  let [mention, ...reason] = args.split(" ")

  //handle there not being a mentioned member
  if (message.mentions.members.size === 0)
    return message.reply({content:"please mention a user to kick"});

  //handle the bot not having the required permission
  if (!message.guild.me.permissions.has("KICK_MEMBERS"))
    return message.reply({content:"I don't have the permission for this"});

  //grab offender metadata
  const kickMember = message.mentions.members.first();
	const log = message.mentions.users.first().tag;

  //the actual kick
  kickMember.kick(reason.join(" ")).then(member => {
    message.reply({content:`${member.user.username} was succesfully kicked.`});

  //log it, if the logging channel is set
  const logChannel = message.guild.channels.cache.find(channel => channel.name === "mod-log").id;
  if (!logChannel) return;
  client.channels.cache.get(logChannel).send(`
**user:** ${log}
**action taken:** kick
**reason for action:** ${reason.join(" ")}
**date/time and timezone:** ${actionDate} GMT`).catch(console.error);
  });
};

exports.config = {
	guildOnly: true,
	aliases: [],
	permLevel: "serverAdmin",
	name: "kick",
	description: "Kick a user",
	usage: ["[<@user>] (<reason>)"]
};