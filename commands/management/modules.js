// module requires
const { Formatters } = require("discord.js");
const { capitalizeAll } = require("../../functionFiles/helperFunctions.js");

exports.run = async (client, message, args) => {
	// check if args is empty
	if (!args) return message.channel.send("Sometimes I wonder if you know what you're doing, please check help for this command");

    // create the variables we'll use
    let [param, ...moduleInput] = args.split(" ").map(elem => elem.toLowerCase());
	moduleInput = moduleInput.join(" ");

	// global variable for always active modules
	const alwaysActiveModules = client.hardcoded.alwaysActiveModules;

    // display a list of all available modules or commands
    if (param === "list") {
		// if no module given, list all modules, otherwise list all commands for said module
        if (!moduleInput) {
			// variable to hold all module names and the currently active modules for a server
            let modules = [];
			let enabledModules = client.cache[message.guild.id].enabledModules.filter(name => !alwaysActiveModules.includes(name));

            // grab all category names
            client.commands.forEach(command => {
                if (!modules.includes(command.config.category)) {
                    modules.push(command.config.category);
                }
            });

			// get the deactivated modules
			let disabledModules = modules.filter(name => (alwaysActiveModules.includes(name) || enabledModules.includes(name) ? false : true));

			// return message showing all modules
            return message.channel.send(Formatters.codeBlock("asciidoc",
				`== I have quite a few modules... ==\n\n` +
				`Always enabled modules ::\n${alwaysActiveModules.map(item => capitalizeAll(item)).join("\n")}\n\n` +
				`${enabledModules.length === 0 ? `= No other modules are enabled right now. =` : `Enabled modules ::\n${enabledModules.map(item => capitalizeAll(item)).sort().join("\n")}`}\n\n` +
				`${disabledModules.length === 0 ? `= No modules disabled. =` : `Disabled modules ::\n${disabledModules.map(item => capitalizeAll(item)).sort().join("\n")}`}`
			));
        } else {
            let commands = [];
			let category = ""
			let longestName = 0;
            // grab all commands in the given category
            client.commands.forEach(command => {
                if (moduleInput === command.config.category) {
                    commands.push(command);
					if (category === "") category = command.config.category;
					if (command.config.name.length > longestName) longestName = command.config.name.length;
                }
            });

			// message if no commands found in category
            if (commands.length === 0) return message.channel.send("What. the. hell. do you want from me ;-;\nI don't know of such a categry")
            return message.channel.send(Formatters.codeBlock("asciidoc",
				`== Here's all the commands in the ${capitalizeAll(moduleInput)} module ==\n\n` +
				`${commands.map(item => `${item.config.name.padEnd(longestName, " ")} :: ${item.config.description}`).join("\n")}`
			));
        }

    // code to disable modules
	} else if (param === "disable") {
        if (!moduleInput) return message.channel.send("What in tarnation... What module were you looking for?");
        if (alwaysActiveModules.includes(moduleInput)) return message.channel.send("You monster... :( I'm not going to allow this");

        // grab our cache in a variable
        let enabledModules = client.cache[message.guild.id].enabledModules;

        // push disabled module to mongo
        if (enabledModules.includes(moduleInput)) {
			// remove the enabled module from the variable
			let disabledModule = enabledModules.splice(enabledModules.indexOf(moduleInput), 1);

			// update our cache and mongo
			client.cache[message.guild.id].enabledModules = enabledModules;
			client.serverData.set(`${message.guild.id}.enabledModules`, enabledModules);

			// confirmation to user that it was disabled
            message.channel.send(`\`${capitalizeAll(disabledModule[0]).replace(/\`/g, "")}\` module disabled`);
        } else {message.channel.send("Yeah that one's already disabled")}

    // code to enable modules
    } else if (param === "enable") {
        if (!moduleInput) return message.channel.send("What in tarnation... What module were you looking for?");

        // grab our cache in a variable
        let enabledModules = client.cache[message.guild.id].enabledModules;

        // add enabled module from mongo
        if(!enabledModules.includes(moduleInput)) {
			// push the enabled module into the variable
			enabledModules.push(moduleInput);

			// update our cache and mongo
            client.cache[message.guild.id].enabledModules = enabledModules
            client.serverData.set(`${message.guild.id}.enabledModules`, enabledModules)

			// confirmation to user that it was enabled
            message.channel.send(`\`${capitalizeAll(moduleInput).replace(/\`/g, "")}\` module enabled`);
        } else {message.channel.send("Mmmmhm why are you trying to enable that one again?")}
    }
}

exports.config = {
    enabled: true,
    guildOnly: true,
    aliases: ["module"],
    permLevel: "serverAdmin",
    name: "modules",
    description: "List, enable, or disable modules",
    usage: ["[list || enable || disable] [<module name>]"]
};
