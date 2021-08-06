exports.run = async(client, message) => {
    const moment = require("moment-timezone");
    require("moment-duration-format");

    let recup = `Recent and upcoming birthdays: \n`
    let today =  moment()

    let db = await client.birthdays.filter(p => p.timezone)
    for (ident of db) {
        if(ident[1]['guild'] === message.guild.id){
            diff = moment(ident[1]['date'] + `-${moment().year()}`).diff(moment(), "days")
            if(diff >= -7 && diff <= 14) {
                recup = recup + `\n\`${ident[1]['date']}\` - ${client.guilds.cache.get(message.guild.id).members.cache.get(ident[1]['username']).user.tag}`
            }
        }
    }
    message.channel.send({content:recup})
}

exports.conf = {
	enabled: true,
	guildOnly: true,
	aliases: [],
    permLevel: "User"
};

exports.help = {
	name: "bd-upcoming",
	category: "Birthdays",
	description: "Displays upcoming and recent birthdays",
	usage: "bd-upcoming"
};