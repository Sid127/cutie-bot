module.exports = {
    name: "guildMemberAdd",
    async execute(member, client) {
        const { EmbedBuilder } = require("discord.js");
        let roles = await client.serverData.get(`${member.guild.id}.autoRole`)
        if (!roles){} else{
            for (role of roles){
                member.roles.add(role).catch(console.error);
            }
        }

        const key = `${member.guild.id}`

        const embed = new EmbedBuilder()
            .setColor(0xffd1dc)
            .setDescription(`${member.user} joined the server`)
            .setTimestamp();

        if (await !client.serverData.has(`${key}`)) return;

        if (!await client.serverData.get(`${key}.welcomeChnl`)){} else {
            const sendChnl = await client.serverData.get(`${key}.welcomeChnl`)
            let welcomeMsg = await client.serverData.get(`${key}.welcome`)
            welcomeMsg = welcomeMsg.replaceAll("{user}", `<@${member.id}>`).replaceAll("{server}", `${member.guild.name}`)

            client.channels.cache.get(sendChnl).send(welcomeMsg).catch(console.error);

        }

        if (await client.serverData.get(`${key}.logChnl`) === null) {} else {
            const sendChnl = await client.serverData.get(`${key}.logChnl`)
            client.channels.cache.get(sendChnl).send({embeds: [embed]}).catch(console.error);
        }
    }
}