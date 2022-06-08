exports.run = async(client, message, args, level) => {
	const moment = require("moment-timezone");
	
    //if a member is mentioned, get their info
    if (message.mentions.members.size > 0) {
        member = message.mentions.members.first();
        let bdayEnabled = await client.peopleData.get(`${member.id}.${message.guild.id}.bdayEnabled`)
        if(bdayEnabled === false) return message.channel.send("I know their birthday but they haven't allowed me to tell anyone on this server :P")
        date = await client.peopleData.get(`${member.id}.date`)
        if(!date) return message.channel.send("Are you sure they were born?")
		date = moment(date, "MM-DD").format("Do MMMM")
        message.channel.send({content:`${member.user.tag}'s birthday is on ${date}!`})
    //or just get your own
    } else {
        member = message.member;
        date = await client.peopleData.get(`${member.id}.date`)
        let bdayEnabled = await client.peopleData.get(`${member.id}.${message.guild.id}.bdayEnabled`)
        if(bdayEnabled === false) return message.channel.send("I know your birthday but you haven't allowed me to tell anyone on this server. If you want to change that, just use the `bd-set` command")
        if(!date) return message.channel.send("Are you sure you were born?")
		date = moment(date, "MM-DD").format("Do MMMM")
        message.channel.send({content:`Your birthday is on ${date}!`})
    }
}

exports.config = {
	guildOnly: true,
	aliases: [],
    permLevel: "User",
	name: "bd-when",
	description: "Finds a user's birthday. If no user is specified, finds your birthday",
	usage: ["(@user)"]
};
