exports.run = async(client, message) => {
    const moment = require("moment-timezone");

    let recup = `Recent and upcoming birthdays: \n`;

    //grab data from mongo
    let db = await client.peopleData.filter(p => p != null && p.date && `${message.guild.id}` in p);
    for (ident of db) {
        date = `${moment().year()}-${ident[1]['date']}`; //format date to ISO 8601 format
        //strip data to only include birthdays from up to one week before now or 2 weeks away from now
        diff = moment(date).diff(moment(), "days");
    
        if (diff >= -7 && diff <= 14) {
            guild = client.guilds.cache.get(message.guild.id);
            member = message.guild.members.cache.get(ident[0]);
            if (!member) {} else {
                recup = recup + `\n\`${ident[1]['date']}\` - ${member.user.tag}`;
            }
        }
    }

    if (recup === `Recent and upcoming birthdays: \n`) return message.channel.send("No recent or upcoming birthdays");

    message.channel.send(recup);
}

exports.config = {
	guildOnly: true,
	aliases: [],
    permLevel: "User",
	name: "bd-upcoming",
	description: "Displays birthdays from up to one week before now or 2 weeks away from now",
	usage: []
};
