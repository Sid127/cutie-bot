exports.run = async(client, message, args) => {
    const { Client, MessageEmbed } = require('discord.js');

    const key = `${message.guild.id}`
    if (args.toLowerCase().trim() === "anon") {
        await client.serverData.set(`${key}.anonChnl`, null);
        message.channel.send({content:"Anonymous channel unset"})
    } else if (args.toLowerCase().trim() === "logger") {
        await client.serverData.set(`${key}.logChnl`, null)
        message.channel.send({content:"Log channel unset"})
    } else {
        message.channel.send("You aren't doing it right - the command is `qt unset <anon/logger>`")
    }
}

exports.config = {
	guildOnly: true,
	aliases: [],
	permLevel: "serverAdmin",
	name: "unset",
	category: "Management",
	description: "Removes anonymous/logging/BGS channel",
	usage: ["anon || logger || bgs"]
};
