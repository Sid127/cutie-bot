module.exports = {
    name: "guildMemberRemove",
    async execute(member, client) {
        const { MessageEmbed } = require("discord.js");

        const key = `${member.guild.id}`

        const embed = new MessageEmbed()
            .setColor(0xffd1dc)
            .setDescription(`${member.user} left the server`)
            .setTimestamp();

        if (await client.peopleData.has(`${member.guild.id}-${member.id}`)){
            await client.peopleData.delete(`${member.guild.id}-${member.id}`)
        }

        if (await !client.serverData.has(`${key}`)) return;
        if (await client.serverData.get(`${key}.logChnl`) === null) return;
        const sendChnl = await client.serverData.get(`${key}.logChnl`)
        client.channels.cache.get(sendChnl).send({embeds: [embed]}).catch(console.error);
    }
}