exports.run = async (client, message) => {
    const { Formatters, Util } = require("discord.js");

    let output = `Here's a list of all the custom commands on this server:\n\n${Object.keys(client.cache[message.guild.id].cc).join("\n")}`

    let splitOutput = Util.splitMessage(output, {maxLength: 2000, char: "\u200b"});
    for (let chunk of splitOutput) {
        await message.channel.send(Formatters.codeBlock("asciidoc", chunk.trim()));
    }
}

exports.config = {
	guildOnly: true,
	aliases: ["customcommandslist"],
	permLevel: "User",
	name: "cclist",
	description: "List all custom commands",
	usage: []
};