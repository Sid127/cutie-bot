module.exports = {
    name: "messageDelete",
    async execute(message, client) {
        const { EmbedBuilder } = require("discord.js");
        if (!message.guild) return;
        const key = `${message.guild.id}`

        if (await !client.serverData.has(`${key}`)) return;
        if (await client.serverData.get(`${key}.logChnl`) === null) return;

        if (message.partial) return;
        if (message.content === null) return;

        if (message.attachments.size > 0) {
            const embed = new EmbedBuilder()
                .setColor(0xffd1dc)
                .addFields([{name: `Message deleted in #${message.channel.name}`, value: `*An image/video was deleted*`},
                            {name: `Message Author`, value: `${message.author} || 'Unknown D:'`}])
                .setTimestamp();
            const sendChnl = await client.serverData.get(`${key}.logChnl`)
            client.channels.cache.get(sendChnl).send({embeds: [embed]})
        } else if (message.author.bot) {} else {
            const embed = new EmbedBuilder()
                .setColor(0xffd1dc)
                .addFields([{name: `Message deleted in #${message.channel.name}`, value: `${message.content || 'Unknown D:'}`},
                            {name:`Message Author`, value:`${message.author || 'Unknown D:'}`}])
                .setTimestamp();
            const sendChnl = await client.serverData.get(`${key}.logChnl`)
            client.channels.cache.get(sendChnl).send({embeds: [embed]})
        }
    }
}
