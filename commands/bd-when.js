exports.run = async(client, message, args, level) => {

    //if a member is mentioned, get their info
    if (message.mentions.members.size > 0) {
        member = message.mentions.members.first();
        date = await client.peopleData.get(`${message.guild.id}-${member.id}.date`)
        message.channel.send({content:`${member.user.tag}'s birthday is on ${date}!`})
    //or just get your own
    } else {
        member = message.member;
        date = await client.peopleData.get(`${message.guild.id}-${member.id}.date`)
        message.channel.send({content:`Your birthday is on ${date}!`})
    }
}

exports.config = {
	guildOnly: true,
	aliases: [],
    permLevel: "User",
	name: "bd-when",
	category: "Birthdays",
	description: "Finds a user's birthday. If no user is specified, finds your birthday",
	usage: ["(@user)"]
};