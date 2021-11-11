module.exports = {
    name: "guildMemberAdd",
    async execute(member, client) {
        const { MessageEmbed } = require("discord.js");
        let roles = await client.serverData.get(`${message.guild.id}.autoRole`)
        for (role of roles){
            member.roles.add(role).catch(console.error);
        }
        const key = `${member.guild.id}`

        const embed = new MessageEmbed()
            .setColor(0xffd1dc)
            .setDescription(`${member.user} joined the server`)
            .setTimestamp();

        if (await !client.serverData.has(`${key}`)) return;
        if (await client.serverData.get(`${key}.logChnl`) === null) return;
        const sendChnl = await client.serverData.get(`${key}.logChnl`)
        client.channels.cache.get(sendChnl).send({embeds: [embed]}).catch(console.error);
    }
}