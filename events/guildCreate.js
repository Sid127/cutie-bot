module.exports = {
    name: "guildCreate",
    async execute(guild, client) {
        await client.serverData.ensure(`${guild.id}`, {
            guild: guild.id,
            anonChnl: null,
            logChnl: null,
            prefix: "",
            activityLeaderboard: "enabled",
            disabledModules: [],
            customCommands: {},
            home: {homeSys: undefined},
            hiddenRoles: [],
            blacklistPfx: []
        });

        client.cache[guild.id] = {}
        client.cache[guild.id]["disabledModules"] = []
        client.cache[guild.id]["prefix"] = ""
        client.cache[guild.id]["activityLeaderboard"] = "enabled"
        client.cache[guild.id]["homeSys"] = undefined
        client.cache[guild.id]["cc"] = {}
    }
}