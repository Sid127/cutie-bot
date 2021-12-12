exports.run = async(client, message) => {
    const moment = require("moment-timezone");
    require("moment-duration-format");

    let recup = `Recent and upcoming birthdays: \n`

    //grab data from mongo
    let db = await client.peopleData.filter(p => p.timezone)
    for (ident of db) {
        if(ident[1]['guild'] === message.guild.id){
            date = `${moment().year()-ident[1]['date']}` //format date to ISO 8601 format
            //strip data to only include birthdays from up to one week before now or 2 weeks away from now
            diff = moment(date).diff(moment(), "days")
            if(diff >= -7 && diff <= 14) {
                guild = client.guilds.cache.get(message.guild.id)
                member = guild.members.cache.get(ident[1]['username'])
                if(!member){}else{
                    recup = recup + `\n\`${ident[1]['date']}\` - ${member.user.tag}`
                }
            }
        }
    }

    if(recup === `Recent and upcoming birthdays: \n`) return message.channel.send("No recent or upcoming birthdays")

    message.channel.send({content:recup})
}

exports.config = {
	guildOnly: true,
	aliases: [],
    permLevel: "User",
	name: "bd-upcoming",
	description: "Displays birthdays from up to one week before now or 2 weeks away from now",
	usage: []
};
