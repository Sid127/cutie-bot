module.exports = {
    name: "guildMemberAdd",
    async execute(member, client) {
        const { MessageEmbed } = require("discord.js");
        var role = member.guild.roles.cache.find(role => role.name == 'unverified')
        if (!role) {
            member.guild.roles.create({
                name: "unverified",
                mentionable: false,
            }).then(function(role) {
                member.roles.add(role);
            }).catch(console.error);
        } else {
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