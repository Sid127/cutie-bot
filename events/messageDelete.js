module.exports = {
    name: "messageDelete",
    async execute(message, client) {
        const { MessageEmbed } = require("discord.js");
        if (!message.guild) return;
        const key = `${message.guild.id}`

        if (await !client.serverData.has(`${key}`)) return;
        if (await client.serverData.get(`${key}.logChnl`) === null) return;

        if (message.partial) return;
        if (message.content === null) return;

        if (message.attachments.size > 0) {
            const embed = new MessageEmbed()
                .setColor(0xffd1dc)
                .addField(`Message deleted in #${message.channel.name}`, `*An image/video was deleted*`)
                .addField(`Message Author`, `${message.author}`)
                .setTimestamp();
            const sendChnl = await client.serverData.get(`${key}.logChnl`)
            client.channels.cache.get(sendChnl).send({embeds: [embed]})
        } else if (message.author.bot) {} else {
            const embed = new MessageEmbed()
                .setColor(0xffd1dc)
                .addField(`Message deleted in #${message.channel.name}`, `${message.content}`)
                .addField(`Message Author`, `${message.author}`)
                .setTimestamp();
            const sendChnl = await client.serverData.get(`${key}.logChnl`)
            client.channels.cache.get(sendChnl).send({embeds: [embed]})
        }
    }
}