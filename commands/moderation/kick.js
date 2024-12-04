exports.run = async (client, message, args) => {
  const moment = require("moment-timezone");

  let [mention, ...reason] = args.split(" ")

  //check ban perm
  if (!message.member.permissions.has('KickMembers'))
    return message.reply({content:"you can't use this command."});

  //handle there not being a mentioned member
  if (message.mentions.members.size === 0)
    memberUID = message.guild.members.cache.get(mention);
    if (!memberUID)
      return message.reply({content:"please mention a user to ban"});

  //handle the bot not having the required permission
  if (!message.guild.members.me.permissions.has("KickMembers"))
    return message.reply({content:"I don't have the permission for this"});

  //grab offender metadata
  const kickMember = message.mentions.members.first();
	const log = message.mentions.users.first().tag;

  //prevent self-moderation
  if (kickMember.permissions.has('ViewAuditLog') || kickMember.permissions.has('Administrator')) return message.channel.send("I'm not kicking them! They're powerful D:")

  //the actual kick
  kickMember.kick(reason.join(" ")).then(member => {
    message.reply({content:`${member.user.username} was succesfully kicked.`});
  });

  //log it, if the logging channel is set
  let logChnl = await client.serverData.get(`${message.guild.id}.modLog`)
  if(!logChnl) {logChnl = await client.serverData.get(`${message.guild.id}.logChnl`)}
  const logChannel = message.guild.channels.cache.find(channel => channel.id === logChnl).id;
  if (!logChannel) return;

  client.channels.cache.get(logChannel).send(`**user:** ${log}\n**action taken:** kick\n**reason for action:** ${reason.join(" ")}\n**date/time:** <t:${moment().unix()}>`).catch(console.error);
};

exports.config = {
	guildOnly: true,
	aliases: [],
	permLevel: "serverAdmin",
	name: "kick",
	description: "Kick a user",
	usage: ["[<@user>] (<reason>)"]
};
