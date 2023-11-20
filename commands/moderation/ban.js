exports.run = async (client, message, args) => {
  const moment = require("moment-timezone");

  let [mention, ...reason] = args.split(" ")

  //handle there not being a mentioned member
  if (message.mentions.members.size === 0)
    memberUID = message.guild.members.cache.get(mention);
    if (!memberUID)
      return message.reply({content:"please mention a user to ban"});

  //handle the bot not having the ban permission
  if (!message.guild.me.permissions.has("BanMembers"))
    return message.reply({content:"I don't have the permission for this"});

  //grab offender metadata
  const banMember = message.mentions.members.first() || memberUID;
	const log = banMember.tag;

  //prevent self-moderation
  if (banMember.permissions.has('ViewAuditLog') || banMember.permissions.has('Administrator')) return message.channel.send("I'm not banning them! They're powerful D:")

  //this is the actual ban
  banMember.ban({reason: reason.join(" ")}).then(member => {
    message.reply({content:`${member.user.username} was succesfully banned.`});
  });

  //and here we log it, if logging channel is set
  let logChnl = await client.serverData.get(`${message.guild.id}.modLog`)
  if(!logChnl) {logChnl = await client.serverData.get(`${message.guild.id}.logChnl`)}
  const logChannel = message.guild.channels.cache.find(channel => channel.id === logChnl).id;
  if (!logChannel) return;

  client.channels.cache.get(logChannel).send(`**user:** ${log}\n**action taken:** ban\n**reason for action:** ${reason.join(" ")}\n**date/time:** <t:${moment().unix()}>`).catch(console.error);
};

exports.config = {
	guildOnly: true,
	aliases: [],
	permLevel: "serverAdmin",
	name: "ban",
	description: "Bans a user",
	usage: ["[<@user>] (<reason>)"]
};
