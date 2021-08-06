exports.run = async(client, message, [date, ...timezone]) => {
    const moment = require("moment-timezone");
    require("moment-duration-format");

    await client.birthdays.ensure(`${message.guild.id}-${message.author.id}`, {
        guild: message.guild.id,
        username: message.author.id,
        date: null,
        timezone: null
    });

    if (moment(date, "DD-MMM").format("DD-MMM") !== date) 
        return message.channel.send({content:"Please tell me your date in the DD-MMM format. Example: 17-Aug"})
    
    if (!timezone) {
        await client.birthdays.set(`${message.guild.id}-${message.author.id}.date`, date)
        await client.birthdays.set(`${message.guild.id}-${message.author.id}.timezone`, "Etc/UTC")

        message.channel.send({content:"Your birthday has been recorded!"})
    } else {
        await client.birthdays.set(`${message.guild.id}-${message.author.id}.date`, date)
        await client.birthdays.set(`${message.guild.id}-${message.author.id}.timezone`, timezone)

        message.channel.send({content:"Your birthday has been recorded!"})
    }
}

exports.conf = {
	enabled: true,
	guildOnly: true,
	aliases: ["bd-add"],
    permLevel: "User"
};

exports.help = {
	name: "bd-set",
	category: "Birthdays",
	description: "Adds your birthday information. Timezone is optional, defaults to UTC",
	usage: "bd-set [date-Mon], <tz-database timezone>\nExample: bd-set 17-Aug Asia/Calcutta"
};