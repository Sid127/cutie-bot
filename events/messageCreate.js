module.exports = {
    name: "messageCreate",
    async execute(message, client) {
        // Ignore all bots
        if (message.author.bot) return;

        // If this is not in a DM, execute the points code.
        if (message.guild) {
            // We'll use the key often enough that simplifying it is worth the trouble.
            const key = `${message.guild.id}-${message.author.id}`;

            // Triggers on new users we haven't seen before.
            await client.peopleData.ensure(`${message.guild.id}-${message.author.id}`, {
                user: message.author.id,
                guild: message.guild.id,
                points: 0,
                level: 0,
                username: message.member.user.tag
            });

            await client.serverData.ensure(`${message.guild.id}`, {
                guild: message.guild.id,
                anonChnl: null,
                logChnl: null,
                prefix: "",
                disabledModules: []
            });
            await client.serverData.ensure(`botSettings`,{
                botadmin: ["319391726613823489", "283607841779089409"]
            });

            if (message.content.length >= 7 && !message.content.startsWith(client.config.prefix)) {
                const oldP = await client.peopleData.get(`${key}.points`)
                let newP = oldP + 1
                await client.peopleData.set(`${key}.points`, newP);
            }


            // Calculate the user's current level
            const curLevel = Math.floor(0.1 * Math.sqrt(await client.peopleData.get(`${key}.points`)));

            // Act upon level up by sending a message and updating the user's level in enmap.
            if (await client.peopleData.get(`${key}.level`) < curLevel) {
                const botChannel = message.guild.channels.cache.find(channel => channel.name === "bot").id;
                if (!botChannel) return;
                client.channels.cache.get(botChannel).send({content:`<@${message.author.id}> leveled up to level **${curLevel}**! :)`});
                await client.peopleData.set(`${key}.level`, curLevel);
            }
            if (await client.peopleData.get(`${key}.level`) > curLevel) {
                const botChannel = message.guild.channels.cache.find(channel => channel.name === "bot").id;
                if (!botChannel) return;
                client.channels.cache.get(botChannel).send({content:`<@${message.author.id}> leveled down to level **${curLevel}** :(`});
                await client.peopleData.set(`${key}.level`, curLevel);
            }
            if (await client.peopleData.get(`${key}.level`) === 3) {
                const rankRole = message.guild.roles.cache.find(role => role.name === "active")
                if (!rankRole){}
                else{
                    message.member.roles.add(rankRole).catch(console.error)
                }
            }
        }

        // Ignore messages not starting with the prefix (in config.json)
        if (!message.content.toLowerCase().trim().startsWith(client.config.prefix)) return;
		
		// Define command and the rest of the text in the message
		let [command, ...args] = message.content.slice(client.config.prefix.length).trim().split(/ +/g);
		// From command slice out prefix length and force lowercase while just joining args together to a string with spaces (since split by them)
		command = command.toLowerCase();
		args = args.join(" ").trim();

        // Grab the command data from the client.commands Map
        const cmd = client.commands.get(command) || client.commands.get(client.aliases.get(command));

        // If that command doesn't exist, silently exit and do nothing
        if (!cmd) return;

        //grab our cache of disabled modules for this server
        let disabledModules = client.disabledModules.get(`${message.guild.id}`)

        // Check perm level and run the command
        if (client.botadmin.includes(`${message.author.id}`)){
            cmd.run(client, message, args);
        } else if (disabledModules.includes(cmd.config.category.toLowerCase())){
            return message.channel.send("That module has been disabled! Ask a server admin to enable it :3")
        } else if (cmd.config.permLevel === "User"){
            cmd.run(client, message, args);
        } else if (cmd.config.permLevel === "modAssist"){
            if (!message.member.permissions.has('VIEW_AUDIT_LOG')){
                return message.reply({content:"you can't use this command."});
            } else {
                cmd.run(client, message, args);
            }
        } else if (cmd.config.permLevel === "serverAdmin"){
            if (!message.member.permissions.has('ADMINISTRATOR'))
                return message.reply({content:"you can't use this command."});
            else {
                cmd.run(client, message, args);
            }
        }
    },
};
