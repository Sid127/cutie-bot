exports.run = (client, message, args) => {
	const { Formatters } = require("discord.js");
	// If no specific command is called, show all filtered commands.
	if (args.trim().length == 0) {
		// variables for different things used
		let longestName = 0;
		let categories = {};
		let userAllowedCmds = [];

		// check what perms the user has and add to userAllowedCmds
		if (message.member.permissions.has('SEND_MESSAGES')) userAllowedCmds.push("User");
		if (message.member.permissions.has('VIEW_AUDIT_LOG')) userAllowedCmds.push("modAssist", "User");
		if (message.member.permissions.has('ADMINISTRATOR')) userAllowedCmds.push("serverAdmin", "modAssist", "User");

		// loop through the commands, checking that it's a guild only one and check if the user perms are enough to use the command (or is bot admin)
		client.commands.forEach(command => {
			if (command.config.guildOnly &&
				(userAllowedCmds.includes(command.config.permLevel) ||
				(client.botadmin.includes(`${message.author.id}`) && command.config.permLevel !== "User"))) {
				// check for the longest name
				longestName = Math.max(longestName, command.config.name.length);

				// add the command to the categories object, with the key, if that exists just add the command to the array under it
				if (!Object.keys(categories).includes(command.config.category)) {
					categories[command.config.category] = [];
				}

				// add the command to the category
				categories[command.config.category].push(command.config);
			}
		});

		// create the "header" for the message
		let output = (`== Command List ==\n` +
			`[Use ${client.config.prefix}helpme <command> for details]\n\n`);

		// create the blocks for each category and add that to output
		for (catKey of Object.keys(categories).sort()) {
			// add the category header to the output
			output += `= ${catKey} =\n`;

			// sort the list by name
			categories[catKey].sort(dynamicSort("name"));

			// loop through all the commands under each category, add padding for all to be same length
			for (cmd of categories[catKey]) {
				output += `${cmd.name.padEnd(longestName, " ")} :: ${cmd.description}\n`
			}

			message.channel.send(Formatters.codeBlock('asciidoc', output));
			output=""
		}
	} else {
		// Show individual command's help.
		let command = args;
		if (client.commands.has(command)) {
			command = client.commands.get(command);
		} else if (client.aliases.has(command)){
			command = client.commands.get(client.aliases.get(command));
		}
		if(command){
			// if (level < client.levelCache[command.config.permLevel])
			// 	return;
			message.channel.send(Formatters.codeBlock('asciidoc',
				`== ${command.config.name} == \n` +
				`${command.config.description}\n` +
				`usage   :: ${command.config.name} ${command.config.usage.join(`\n           ${command.config.name} `)}\n` +
				`aliases :: ${command.config.aliases.join(", ") || "no aliases"}\n`));
		}
	}
};

exports.config = {
	guildOnly: true,
	aliases: ["h", "halp","helpme"],
	permLevel: "User",
	name: "help",
	category: "Miscellaneous",
	description: "Displays all available commands for a user's permission level.",
	usage: ["(<command>)"]
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
