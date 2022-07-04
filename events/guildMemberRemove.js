module.exports = {
    name: "guildMemberRemove",
    async execute(member, client) {
        const { MessageEmbed } = require("discord.js");

        const key = `${member.guild.id}`

        const embed = new MessageEmbed()
            .setColor(0xffd1dc)
            .setDescription(`${member.user} left the server`)
            .setTimestamp();

        await client.peopleData.delete(`${member.id}.${member.guild.id}`)
        if(JSON.stringify(Object.keys(await client.peopleData.get(`${member.id}`)).sort()) === JSON.stringify(["date", "timezone"]) || Object.keys(await client.peopleData.get(`${member.id}`)).length === 0) {await client.peopleData.delete(`${member.id}`)}

        if (await !client.serverData.has(`${key}`)) return;
        if (await client.serverData.get(`${key}.logChnl`) === null) return;
        const sendChnl = await client.serverData.get(`${key}.logChnl`)
        client.channels.cache.get(sendChnl).send({embeds: [embed]}).catch(console.error);
    }
}