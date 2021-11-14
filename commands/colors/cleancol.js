exports.run = (client, message) => {
  const mmbr = message.guild.members.cache.get(message.author.id);
  if (mmbr === client.user) return message.channel.send("Yeah I'm not letting you mess with my colors >:]");

  const roleCheck = message.member.roles.cache.find(a => a.name.endsWith(' col'))
  if (!roleCheck)
    return message.channel.send("You don't have a color role to begin with >:(");

  mmbr.roles.cache.find(a => a.name.endsWith(' col')).delete();
  message.channel.send({content:`${mmbr.displayName}, color removed.`}).catch(console.error)
}

exports.config = {
	guildOnly: true,
	aliases: ["removecol"],
	permLevel: "User",
	name: "cleancol",
	description: "Remove your current color",
	usage: []
};