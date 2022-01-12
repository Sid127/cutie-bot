module.exports = {
    name: "guildCreate",
    async execute(guild, client) {
        await client.serverData.ensure(`${guild.id}`, {
            guild: guild.id,
            anonChnl: null,
            logChnl: null,
            prefix: "",
            activityLeaderboard: "disabled",
			enabledModules: ["management", "moderation", "metadata", "support"],
            customCommands: {},
            home: {homeSys: undefined},
            hiddenRoles: [],
            blacklistPfx: [],
			reactionRoles: {}
        });

        client.cache[guild.id] = {}
        client.cache[guild.id]["enabledModules"] = ["management", "moderation", "metadata", "support"]
        client.cache[guild.id]["prefix"] = ""
        client.cache[guild.id]["activityLeaderboard"] = "disabled"
        client.cache[guild.id]["homeSys"] = undefined
        client.cache[guild.id]["cc"] = []
        client.cache[guild.id]["reactionRoles"] = []
    }
}
