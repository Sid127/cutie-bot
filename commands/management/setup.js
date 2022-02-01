const moduleList = {
  "activitypoints": "points",
  "anon": "confession",
  "autorole": "management",
  "bd-config": "birthdays",
  "bgs": "elite",
  "home": "elite",
  "logger": "moderation",
  "prefix": "management",
  "prestige": "points",
  "ticket": "tickets",
  "verifiedrole": "management",
  "welcome": "management"
};

exports.run = async(client, message, args) => {
    if(!args) return message.channel.send("...what on Earth do you want me to do")
    const fs = require('fs')

    let [arg1, ...arg2] = args.split(" ")

	if (!client.cache[message.guild.id].enabledModules.includes(moduleList[arg1])) return message.channel.send("That module is disabled, frendo. Enable it first, and then you can set it up")

    fs.access(`${__dirname}/setupBits/${arg1}.js`, (err) => {
        if (err) {
            message.channel.send("Lord help me D:")
        } else {
            const code = require(`${__dirname}/setupBits/${arg1}.js`);
            code.run(client, message, arg2)
        }
    });
}

exports.config = {
	guildOnly: true,
	aliases: [],
	permLevel: "serverAdmin",
	name: "setup",
	description: "Set up various bot modules. For the welcome module, {user} will mention and {server} will input the server name",
	usage: [
        "[anon || bd-config channel || bgs || ticket] (off) [<#channel>]",
        "bd-config role [<@birthday role>]",
        "prefix [<prefix>]",
        "activitypoints [enabled || disabled]", "home", "prestige [<level>] [<@role>]",
        "autorole [<@roles>]",
        "verifiedrole (agegate) [<@roles>]",
        "welcome [<#channel> || show || off] [<welcome message>]",
		"logger (off) (ticket || modlog) [<#channel>]"
    ]
};
