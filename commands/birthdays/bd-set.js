exports.run = async(client, message, args) => {
    const { capitalizeString } = require("../../functionFiles/helperFunctions.js");
    const moment = require("moment-timezone");
    require("moment-duration-format");

    if(!args) return message.channel.send("Yeah, what?")

	args = args.replace("the", "").replace("th", "").replace("of", "")

	args = moment(args).format("DD-MMM")
	if (args.toLowerCase() === "invalid date") return message.channel.send("I dunno how but something went horribly wrong")

    let [dateStub, month] = args.split("-")
    month = capitalizeString(month.toLowerCase())
    date = `${dateStub}-${month}`

    //create an empty mongo entry for the user that is also server specific
    await client.peopleData.ensure(`${message.guild.id}-${message.author.id}`, {
        guild: message.guild.id,
        username: message.author.id,
        date: null,
        timezone: null
    });

    //handle the actual info
    if (moment(date, "DD-MMM").format("DD-MMM") !== date)
        return message.channel.send({content:"Please tell me your date in the DD-MMM format. Example: 17-Aug"})

    if (!timezone) {
        await client.peopleData.set(`${message.guild.id}-${message.author.id}.date`, date)
        await client.peopleData.set(`${message.guild.id}-${message.author.id}.timezone`, "Etc/UTC")

        message.channel.send({content:"Your birthday has been recorded!"})
    } else {
	if(!moment.tz.zone(timezone))
	    return message.channel.send({content:"Invalid timezone format :(\nFind your timezone here <https://xske.github.io/tz/>"})
        await client.peopleData.set(`${message.guild.id}-${message.author.id}.date`, date)
        await client.peopleData.set(`${message.guild.id}-${message.author.id}.timezone`, timezone)

        message.channel.send({content:"Your birthday has been recorded!"})
    }
}

exports.config = {
	guildOnly: true,
	aliases: ["bd-add"],
    permLevel: "User",
	name: "bd-set",
	description: "Adds your birthday information. Timezone is optional, defaults to UTC",
	usage: ["[<date-Mon>] (<tz-database timezone>)"]
};
