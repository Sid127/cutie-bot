exports.run = (client, message) => {
    const { Formatters } = require("discord.js");
    const moment = require("moment");
    require("moment-duration-format");

    const duration = moment.duration(client.uptime).format(" D [days], H [hrs], m [mins], s [secs]");

    message.channel.send(Formatters.codeBlock('asciidoc', `= Cutie Status =
• Mem Usage  :: ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB
• Uptime     :: ${duration}
• Servers    :: ${client.guilds.cache.size.toLocaleString()}
• Users      :: ${client.users.cache.size.toLocaleString()}
• Github     :: https://codeberg.org/Sid127/cutie-bot
= Cutie was queer coded by Sid <3 =`));

}

exports.config = {
	guildOnly: true,
	aliases: ["ping"],
	permLevel: "User",
	name: "status",
	description: "Check if the bot is online",
	usage: []
};
