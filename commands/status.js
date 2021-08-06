exports.run = (client, message) => {
    const { Formatters } = require("discord.js");
    const moment = require("moment");
    require("moment-duration-format");
    var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

    const duration = moment.duration(client.uptime).format(" D [days], H [hrs], m [mins], s [secs]");

    message.channel.send(Formatters.codeBlock('asciidoc', `= Cutie Status =
• Mem Usage  :: ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB
• Uptime     :: ${duration}
• Servers    :: ${client.guilds.cache.size.toLocaleString()}
• Users      :: ${client.users.cache.size.toLocaleString()}
• Github     :: https://github.com/Sid127/cutie-bot
= Cutie was created by Sid <3 =`));

}

exports.conf = {
	enabled: true,
	guildOnly: true,
	aliases: ["ping"],
	permLevel: "User"
};

exports.help = {
	name: "status",
	category: "Miscellaneous",
	description: "Check if the bot is online",
	usage: "status"
};
