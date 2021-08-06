exports.run = async(client, message, args, level) => {
    if (message.mentions.members.size > 0) {
        member = message.mentions.members.first();
        date = await client.birthdays.get(`${message.guild.id}-${member.id}.date`)
        message.channel.send({content:`${member.user.tag}'s birthday is on ${date}!`})
    } else {
        member = message.member;
        date = await client.birthdays.get(`${message.guild.id}-${member.id}.date`)
        message.channel.send({content:`Your birthday is on ${date}!`})
    }
}

exports.conf = {
	enabled: true,
	guildOnly: true,
	aliases: [],
    permLevel: "User"
};

exports.help = {
	name: "bd-when",
	category: "Birthdays",
	description: "Finds a user's birthday. If no user is specified, finds your birthday",
	usage: "bd-when <user>"
};