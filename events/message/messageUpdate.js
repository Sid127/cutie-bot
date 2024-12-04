module.exports = {
    name: "messageUpdate",
    async execute(oldMessage, newMessage, client) {
        const { EmbedBuilder } = require("discord.js");

        if (!oldMessage.guild) return;
        if (oldMessage.partial) return;
        if (!oldMessage.content) return;
        if (oldMessage.content === newMessage.content) return;

        const key = `${oldMessage.guild.id}`
        const embed = new EmbedBuilder()
            .setColor(0xffd1dc)
            .setTitle(`Message updated in #${oldMessage.channel.name}`)
            .addFields([
                {name: `Message Author`, value: `${oldMessage.author}`},
                {name: `Old Message`, value: oldMessage.content},
                {name: `New Message`, value: newMessage.content
            }])
            .setTimestamp()

        if (await !client.serverData.has(`${key}`)) return;
        if (await client.serverData.get(`${key}.logChnl`) === null) return;
        const sendChnl = await client.serverData.get(`${key}.logChnl`)
        client.channels.cache.get(sendChnl).send({embeds: [embed]})
    }
}
