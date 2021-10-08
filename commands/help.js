exports.run = (client, message, args, level) => {
	const { Formatters } = require("discord.js");
	// If no specific command is called, show all filtered commands.
	if (!args[0]) {
		// variables for different things used
		let longestName = 0;
		let categories = {};

		// loop through the commands, checking that it's a guild only one and not modmin
		client.commands.forEach(command => {
			if (command.conf.guildOnly && command.conf.permLevel === "User") {
				// check for the longest name
				longestName = Math.max(longestName, command.help.name.length);

				// add the command to the categories object, with the key, if that exists just add the command to the array under it
				if (!Object.keys(categories).includes(command.help.category)) {
					categories[command.help.category] = [];
				}

				// add the command to the category
				categories[command.help.category].push(command.help);
			}
		});

		// create the "header" for the message
		let output = (`== Command List ==\n` +
			`[Use ${client.config.prefix}helpme <command> for details]\n`);

		// create the blocks for each category and add that to output
		for (catKey of Object.keys(categories).sort()) {
			// add the category header to the output
			output += `\u200b\n= ${catKey} =\n`;

			// sort the list by name
			categories[catKey].sort(dynamicSort("name"));

			// loop through all the commands under each category, add padding for all to be same length
			for (cmd of categories[catKey]) {
				output += `${cmd.name.padEnd(longestName, " ")} :: ${cmd.description}\n`
			}
		}

		message.channel.send(Formatters.codeBlock('asciidoc', output));
	} else {
		// Show individual command's help.
		let command = args[0];
		if (client.commands.has(command)) {
			command = client.commands.get(command);
			// if (level < client.levelCache[command.conf.permLevel])
			// 	return;
			message.channel.send(Formatters.codeBlock('asciidoc',
				`= ${command.help.name} = \n` +
				`${command.help.description}\n` +
				`usage:: ${command.help.usage}\n` +
				`aliases:: ${command.conf.aliases.join(", ")}\n` +
				`= ${command.help.name} =`));
		}
	}
};

exports.conf = {
	enabled: true,
	guildOnly: true,
	aliases: ["h", "halp","helpme"],
	permLevel: "User"
};

exports.help = {
	name: "help",
	category: "Miscellaneous",
	description: "Displays all the available commands for your permission level.",
	usage: "help <command>"
};

// helper function for sorting
function dynamicSort(property) {
    var sortOrder = 1;

    if (property[0] === "-") {
        sortOrder = -1;
        property = property.substr(1);
    }

    return function (a,b) {
        if (sortOrder == -1){
            return b[property].localeCompare(a[property]);
        } else {
            return a[property].localeCompare(b[property]);
        }
    }
}
