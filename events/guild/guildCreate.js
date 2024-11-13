module.exports = {
    name: "guildCreate",
    async execute(guild, client) {
        if (!client.cache.tick) {
            console.log('Waiting for cache before processing message');
            await new Promise(resolve => setTimeout(resolve, 2500));
        }
        await client.serverData.ensure(`${guild.id}`, {
            guild: guild.id,
            anonChnl: null,
            logChnl: null,
            prefix: "",
            activityLeaderboard: "disabled",
			enabledModules: ["management", "moderation", "metadata", "support"],
            customCommands: {},
            home: {system: null},
			reactionRoles: {}
        });

        client.cache[guild.id] = client.hardcoded.defaultCache
    }
}
