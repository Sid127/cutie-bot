module.exports = {
    name: "guildMemberRemove",
    async execute(member, client) {
        const { MessageEmbed } = require("discord.js");

        const key = `${member.guild.id}`

        await client.peopleData.delete(`${member.id}.${member.guild.id}`)
        let memberData = await client.peopleData.get(member.id)
        if(JSON.stringify(Object.keys(memberData).sort()) === JSON.stringify(["date", "timezone"]) || Object.keys(memberData).length === 0) {await client.peopleData.delete(`${member.id}`)}

        if (await client.serverData.get(`${key}.logChnl`) === null) return;
        
        const embed = new MessageEmbed()
            .setColor(0xffd1dc)
            .setDescription(`${member.user} left the server`)
            .setTimestamp();
        const sendChnl = await client.serverData.get(`${key}.logChnl`)
        client.channels.cache.get(sendChnl).send({embeds: [embed]}).catch(console.error);
    }
}