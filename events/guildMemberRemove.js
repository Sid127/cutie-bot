module.exports = {
    name: "guildMemberRemove",
    async execute(member, client) {
        const { MessageEmbed } = require("discord.js");

        const key = `${member.guild.id}`

        const embed = new MessageEmbed()
            .setColor(0xffd1dc)
            .setDescription(`${member.user} left the server`)
            .setTimestamp();

        if (await client.birthdays.has(`${member.guild.id}-${member.id}`)){
            await client.birthdays.delete(`${member.guild.id}-${member.id}`)
        }

        if (await !client.settings.has(`${key}`)) return;
        if (await client.settings.get(`${key}.logChnl`) === null) return;
        const sendChnl = await client.settings.get(`${key}.logChnl`)
        client.channels.cache.get(sendChnl).send({embeds: [embed]}).catch(console.error);
    }
}