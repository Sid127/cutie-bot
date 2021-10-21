module.exports = {
    name: "messageUpdate",
    async execute(oldMessage, newMessage, client) {
        const { MessageEmbed } = require("discord.js");

        if (!oldMessage.guild) return;
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

        if (await !client.serverData.has(`${key}`)) return;
        if (await client.serverData.get(`${key}.logChnl`) === null) return;
        const sendChnl = await client.serverData.get(`${key}.logChnl`)
        client.channels.cache.get(sendChnl).send({embeds: [embed]})
    }
}