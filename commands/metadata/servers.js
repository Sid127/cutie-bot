exports.run = async (client, message, args) => {
    const { MessageEmbed } = require("discord.js")

    let tempMessage = await message.channel.send("Hang tight, crunching latest data...");

    const embed = new MessageEmbed()
        .setTitle("Bot Info")
        .setAuthor(client.user.username, client.user.avatarURL)
        .setDescription("Here's the current data on all the server's I'm in:")
        .setColor('RANDOM');

    for (guild of client.guilds.cache){
        embed.addField(`${guild[1].name} (${guild[1].id})`, `${guild[1].memberCount} members`, true)
    }
    tempMessage.edit({embeds: [embed]})
}

exports.config = {
    enabled: true,
    guildOnly: true,
    aliases: [],
    permLevel: "botAdmin",
    name: "servers",
    description: "Show basic server info for all the servers I'm in",
    usage: []
};