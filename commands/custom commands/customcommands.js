exports.run = async (client, message, args) => {
	const { splitMessage } = require("../../functionFiles/helperFunctions.js")

	// get the data from the message
    let [action, trigger, ...response] = args.split(" ");

	// check if we have list, which everyone can use
	if (action.toLowerCase().trim() === "list" || !action.trim()) {
		const { codeBlock } = require("discord.js");

		// build the "header" for the message, and add on all customs found sorted by name
		let output = `= Here's a list of all the custom commands on this server: =\n\n` +
		`${client.cache[message.guild.id].cc.sort().join("\n")}`

		// split the output if longer than 1900 chars, to get around the message length limit
		let splitOutput = splitMessage(output, {maxLength: 1900, char: "\n"});
		for (let chunk of splitOutput) {
			await message.channel.send(codeBlock("asciidoc", chunk.trim()));
		}

		// just return to not continue doing anything else
		return;
	}

	// if we're here the action was not empty and isn't list, check if the user has right perms first
	if (message.member.permissions.has('ViewAuditLog' || 'Administrator') || client.hardcoded.botAdmin.includes(message.author.id)) {
		// combine the response back to one thing and trim out extra whitespace
		response = response.join(" ").trim();

		// create a simple switch case
		switch (action.toLowerCase().trim()) {
			// take create and add
			case 'create':
			case 'add': {
				// check if reponse is empty, and if the trigger has other than alphanumberic chars and that the command doesn't already exist
				if (response.length === 0) return message.reply("The heck do you want me to respond with..?");
				if (!trigger.match(/^[0-9a-z]+$/)) return message.reply("Sorry, I can only allow English alpha-numeric and lowercase characters in the trigger :(");
				if (client.cache[message.guild.id].cc.includes(trigger)) return message.reply("I found a command with the same trigger and I will not overwrite it, if you meant to edit use `cc edit`");

				// update cache, update mongo and send message
				client.cache[message.guild.id].cc.push(trigger);
				await client.serverData.set(`${message.guild.id}.customCommands.${trigger}`, response);
				message.channel.send(`Custom command \`${client.prefix}${trigger}\` created!`);

				break;
			}
			// take delete and remove
			case 'delete':
			case 'remove': {
				// check if command exists
				if (!client.cache[message.guild.id].cc.includes(trigger)) return message.reply("Nothing has been deleted you unsalted stick of butter (no command with the name found)");

				// update cache, update mongo and send message
				client.cache[message.guild.id].cc.splice(client.cache[message.guild.id].cc.indexOf(trigger), 1);
				await client.serverData.delete(`${message.guild.id}.customCommands.${trigger}`);
				message.channel.send(`Custom command \`${client.prefix}${trigger}\` deleted :c`);

				break;
			}
			// take edit
			case 'edit': {
				// check if reponse is empty, and that the command does exist
				if (response.length === 0) return message.reply("The heck do you want me to respond with..?");
				if (!client.cache[message.guild.id].cc.includes(trigger)) return message.reply("I didn't find a command with that name.");

				// update mongo and send message
				await client.serverData.set(`${message.guild.id}.customCommands.${trigger}`, response);
				message.channel.send(`Custom command \`${client.prefix}${trigger}\` edited!`);

				break;
			}
			default: {
				return message.channel.send("Carbon Copy Protocol initiated :P");
			}
		}
	} else {
		return message.channel.send("You're not powerful enough to use anything but 'list'. Sorry fren.");
	}
}

exports.config = {
	guildOnly: true,
	aliases: ["cc"],
	permLevel: "User",
	name: "customcommands",
	description: "Create/delete a custom command. Use 'cc list' command to view all custom commands",
	usage: ["[create/add || delete/remove || edit] [<trigger>] [<response>]", "[list]"]
};
