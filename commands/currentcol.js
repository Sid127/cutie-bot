exports.run = (client, message, [mention]) => {

  if(message.mentions.members.size === 0){
		color = message.member.roles.cache.find(a => a.name.endsWith(' col'))
		return message.channel.send({content:`${message.author.username} has the color ${color.hexColor}`})
	} else {
		const colormember = message.mentions.members.first();
		color = colormember.roles.cache.find(a => a.name.endsWith(' col'))
		return message.channel.send({content:`${colormember.displayName} has the color ${color.hexColor}`})
	}
}

exports.config = {
	guildOnly: true,
	aliases: [],
	permLevel: "User",
	name: "currentcol",
	category: "Colors",
	description: "Send your (or another user's) current colors hex code",
	usage: ["(@user)"]
};