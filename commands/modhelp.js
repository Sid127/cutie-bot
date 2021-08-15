exports.run = (client, message, args, level) => {
	const {Formatters, Util} = require("discord.js");
	// If no specific command is called, show all filtered commands.
	if (!args[0]) {
		// Filter all commands by which are available for the user's level, using the <Collection>.filter() method.
		const myCommands = client.commands.filter(cmd => cmd.conf.guildOnly === true)

		// Here we have to get the command names only, and we use that array to get the longest name.
		// This make the help commands "aligned" in the output.
		const commandNames = myCommands.keyArray();
		const longest = commandNames.reduce((long, str) => Math.max(long, str.length), 0);

		let currentCategory = "";
		let output = `= Command List =\n\n[Use ${client.config.prefix}helpme <commandname> for details]\n`;
		const sorted = myCommands.array().sort((p, c) => p.help.category > c.help.category ? 1 : p.help.name > c.help.name && p.help.category === c.help.category ? 1 : -1);
		sorted.forEach(c => {
			if (c.conf.permLevel === "Modmin") {
				const cat = c.help.category;
				if (currentCategory !== cat) {
					output += `\u200b\n== ${cat} ==\n`;
					currentCategory = cat;
				}
				output += `${c.help.name}${" ".repeat(longest - c.help.name.length)} :: ${c.help.description}\n`;
			}
		});
		message.channel.send(Formatters.codeBlock('asciidoc', output));
	} else {
		// Show individual command's help.
		let command = args[0];
		if (client.commands.has(command)) {
			command = client.commands.get(command);
			// if (level < client.levelCache[command.conf.permLevel])
			// 	return;
			message.channel.send(Formatters.codeBlock('asciidoc', `= ${command.help.name} = \n${command.help.description}\nusage:: ${command.help.usage}\naliases:: ${command.conf.aliases.join(", ")}\n= ${command.help.name} =`));
		}
	}
};

exports.conf = {
	enabled: true,
	guildOnly: true,
	aliases: ["mh", "modhalp","modhelpme"],
	permLevel: "Modmin"
};

exports.help = {
	name: "modhelp",
	category: "Miscellaneous",
	description: "Displays all the available moderator commands.",
	usage: "modhelp <command>"
};