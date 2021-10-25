module.exports = {
    name: "guildDelete",
    async execute(guild, client) {
        //delete server settings
        client.serverData.delete(`${guild.id}`)

        //also get rid of all user data from that guild
        let keys = await client.peopleData.keys
        for (k of keys){
            if(k.startsWith(`${guild.id}`)){
                client.peopleData.delete(`${k}`)
            }
        }
    }
};