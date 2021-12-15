exports.run = async (client, message, args) => {
    let [action, trigger, ...response] = args.split(" ")

    switch (action) {
        case 'create' : {
            response = response.join(" ")
            if (response === "") return message.channel.send("The heck do you want me to respond with?")
            client.cache[message.guild.id].cc[trigger] = response //update cache
            await client.serverData.set(`${message.guild.id}.customCommands.${trigger}`, response) //update mongo
            message.channel.send(`Custom command ${client.prefix}${trigger} created!`)
        } break;
        case 'delete' : {
            if(!Object.keys(client.cache[message.guild.id].cc).includes(trigger))return message.channel.send("Nothing has been deleted you unsalted stick of butter")
            delete client.cache[message.guild.id].cc[trigger] //update cache
            await client.serverData.delete(`${message.guild.id}.customCommands.${trigger}`) //update mongo
            message.channel.send(`Custom command ${client.prefix}${trigger} deleted :c`)
        } break;
		case 'list' : {
			const { Formatters, Util } = require("discord.js");

		    let output = `= Here's a list of all the custom commands on this server: =\n\n• ${Object.keys(client.cache[message.guild.id].cc).join("\n• ")}`

		    let splitOutput = Util.splitMessage(output, {maxLength: 2000, char: "\u200b"});
		    for (let chunk of splitOutput) {
		        await message.channel.send(Formatters.codeBlock("asciidoc", chunk.trim()));
		    }
		} break;
		default : {
			return message.channel.send("Carbon Copy Protocol initiated :P")
		}
    }
}

exports.config = {
	guildOnly: true,
	aliases: ["cc"],
	permLevel: "modAssist",
	name: "customcommands",
	description: "Create/delete/list a custom command",
	usage: ["[create || delete] [<trigger>] [<response>]", "[list]"]
};
