exports.run = async(client, message, args) => {

	//inital setup
	if(!args && await client.peopleData.has(`${message.author.id}.date`)) {
		await client.peopleData.set(`${message.author.id}.${message.guild.id}.bdayEnabled`, true)
		return message.channel.send("Hey, I remember your birthday already! I'll wish you here too from now on :D")
	}
	if (!args) return message.channel.send("Yeah... what?")
	args = args.toLowerCase()
    const { capitalizeString } = require("../../functionFiles/helperFunctions.js");
    const moment = require("moment-timezone");

	//extract the date from the input
	let date = args.match(/\d+/)
	if (!date) return message.channel.send("Wait.. where's the date? D:")
	date = parseInt(date.shift())

	//parse the month
	let month = args.match(/jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec/g)
	if (!month) return message.channel.send("You see... I need a month too")
	month = month.shift()

	//define an object with date limits
	let dateLimits = {
		"!31" : ["feb", "apr", "jun", "sept", "nov"],
		"!30" : ["feb"]
	}

	//some date checks for date validation
	if (date === 30 && dateLimits["!30"].includes(month))
		return message.channel.send("That date, hm, are you sure it belongs to that month?")
	if (date === 31 && dateLimits["!31"].includes(month))
		return message.channel.send("That date, hm, are you sure it belongs to that month?")
	if (date > 31)
		return message.channel.send("Woah, new calendar format? Gimme a Gregorian date please")

	//extract and parse a timezone, defaults to UTC
	timezone = args.substr(args.lastIndexOf(" ")+1)

	if(timezone.includes("/")) {
		if(!moment.tz.zone(timezone)){
			return message.channel.send("I'm afraid I can't work with that timezone format, maybe paste the one from this website? <https://xske.github.io/tz/>")
		}
	} else {
		message.channel.send("Invalid or no timezone detected, defaulting to Etc/UTC\nSet a timezone using the bd-zone command")
		timezone = "Etc/UTC"
	}

	//convert month to be plugged into an ISO format
	month = moment(capitalizeString(month), "MMM").format("MM")
    birthDate = `${month}-${date}`

    //create an empty mongo entry for the user
    await client.peopleData.ensure(`${message.author.id}`, { 
        date: null,
        timezone: null
    });

    //push this to mongo
    await client.peopleData.set(`${message.author.id}.date`, birthDate)
    await client.peopleData.set(`${message.author.id}.timezone`, timezone)
	await client.peopleData.set(`${message.author.id}.${message.guild.id}.bdayEnabled`, true)

    message.channel.send({content:"Your birthday has been recorded!"})
}

exports.config = {
	guildOnly: true,
	aliases: ["bd-add"],
    permLevel: "User",
	name: "bd-set",
	description: "Adds your birthday information. Timezone is optional, defaults to UTC",
	usage: ["[<date-Mon>] (<tz-database timezone>)"]
};
