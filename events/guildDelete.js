module.exports = {
    name: "guildDelete",
    async execute(guild, client) {
        //delete server settings
        await client.serverData.delete(`${guild.id}`)

        //also get rid of all user data from that guild
        let guildUsers = client.peopleData.filter(p => p[guild.id])
        for (user of guildUsers) {
            await client.peopleData.delete(`${user[0]}.${user[1][guild.id]}`)
        }
    }
};