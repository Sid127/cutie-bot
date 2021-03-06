module.exports = async(client, oldMessage, newMessage) => {
    const { MessageEmbed } = require("discord.js");

    if (oldMessage.channel.type === 'dm') return;
    if (oldMessage.partial) return;
    if (oldMessage.content === null) return;
    if (oldMessage.embeds[0] != null) return;
    if (oldMessage.content === newMessage.content) return;

    const key = `${oldMessage.guild.id}`
    const embed = new MessageEmbed()
        .setColor(0xffd1dc)
        .setTitle(`Message updated in #${oldMessage.channel.name}`)
        .addField(`Message Author`, `${oldMessage.author}`)
        .addField(`Old Message`, oldMessage.content)
        .addField(`New Message`, newMessage.content)
        .setTimestamp()

    if (await !client.settings.has(`${key}`)) return;
    if (await client.settings.get(`${key}.logChnl`) === null) return;
    const sendChnl = await client.settings.get(`${key}.logChnl`)
    client.channels.cache.get(sendChnl).send(embed)
}