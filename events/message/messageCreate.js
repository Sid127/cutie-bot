module.exports = {
    name: "messageCreate",
    async execute(message, client) {
        // Ignore all bots
        if (message.author.bot) return;

        if (!client.cache.tick) {
            console.log('Waiting for cache before processing message');
            await new Promise(resolve => setTimeout(resolve, 2500));
        }

        //define prefix
        message.guild ? (client.cache[message.guild.id].prefix === "" ? client.prefix = client.config.prefix : client.prefix = client.cache[message.guild.id].prefix) : client.prefix = client.config.prefix

        // Ignore messages not starting with the prefix
        if (!message.content.toLowerCase().trim().startsWith(client.prefix)) return;

        // Define command and the rest of the text in the message
        let [command, ...args] = message.content.slice(client.prefix.length).trim().split(/ +/g);
        // From command slice out prefix length and force lowercase while just joining args together to a string with spaces (since split by them)
        command = command.toLowerCase();
        args = args.join(" ").trim();

        // Grab the command data from the client.commands Map or from the shortcuts object
        let shortcut = Object.keys(client.shortcuts).find(sc => sc === command);
        let cmd = client.commands.get(command) || client.commands.get(client.aliases.get(command)) || (shortcut ? client.commands.get(client.shortcuts[command].cmd) : null);

        // if it's a shortcut, set our args
        if (shortcut)
            args = `${client.shortcuts[command].args} ` + args;

        // If this is not in a DM, execute the code.
        if (message.guild) {
            // We'll use the key often enough that simplifying it is worth the trouble.
            const key = `${message.author.id}.${message.guild.id}`;

            if (client.cache[message.guild.id].activityLeaderboard === "enabled") {
                // Triggers on new users we haven't seen before.
                let ensure = {}
                ensure[`${message.guild.id}`] = {
                    points: 0,
                    level: 0
                }

                await client.peopleData.ensure(`${message.author.id}`, ensure);

                if (message.content.length >= 7 && !message.content.startsWith(client.config.prefix) || !message.content.startsWith(client.cache[message.guild.id].prefix)) {
                    const oldP = await client.peopleData.get(`${key}.points`)
                    let newP = oldP + 1
                    await client.peopleData.set(`${key}.points`, newP);
                }

                // Calculate the user's current level
                const curLevel = Math.floor(0.1 * Math.sqrt(await client.peopleData.get(`${key}.points`)));

                // Act upon level up by sending a message and updating the user's level in enmap.
                if (await client.peopleData.get(`${key}.level`) < curLevel) {
                    const botChannel = await client.serverData.get(`${message.guild.id}.lvlUpChnl`)
                    if (!botChannel) {} else{
                        client.channels.cache.get(botChannel).send({content:`<@${message.author.id}> leveled up to level **${curLevel}**! :)`});
                        await client.peopleData.set(`${key}.level`, curLevel);
                    }
                }
                if (await client.peopleData.get(`${key}.level`) > curLevel) {
                    const botChannel = await client.serverData.get(`${message.guild.id}.lvlUpChnl`)
                    if (!botChannel) {} else{
                        client.channels.cache.get(botChannel).send({content:`<@${message.author.id}> leveled down to level **${curLevel}** :(`});
                        await client.peopleData.set(`${key}.level`, curLevel);
                    }
                }
                if (await client.peopleData.get(`${key}.level`) === await client.serverData.get(`${message.guild.id}.prestigeLevel`)) {
                    const rankRole = await client.serverData.get(`${message.guild.id}.prestigeRole`)
                    if (!rankRole){}
                    else{
                        message.member.roles.add(rankRole).catch(console.error)
                    }
                }
            }

            // if command is a server custom command, send the response
            if (client.cache[message.guild.id].cc.includes(command))
                return message.channel.send(await client.serverData.get(`${message.guild.id}.customCommands.${command}`))

            //grab our cache of disabled modules for this server
            let enabledModules = client.cache[message.guild.id].enabledModules

            if (cmd && !enabledModules.includes(cmd.config.category) && !client.hardcoded.botAdmin.includes(`${message.author.id}`))
                return message.channel.send("The module for that command has been disabled! Ask a server admin to enable it :3")
        }

        // if no command found, return
        if (!cmd) return;

        //handle DMs
        if (!message.guild) {
            if (client.hardcoded.DMModules.includes(cmd.config.category) || command === "help") {
                cmd.run(client, message, args)
                return
            }
            return
        }

        // Check perm level and run the command
        if (client.hardcoded.botAdmin.includes(`${message.author.id}`)){
            cmd.run(client, message, args);
        } else if (cmd.config.permLevel === "User"){
            cmd.run(client, message, args);
        } else if (cmd.config.permLevel === "modAssist"){
            if (!message.member.permissions.has('ViewAuditLog')){
                return message.reply({content:"you can't use this command."});
            } else {
                cmd.run(client, message, args);
            }
        } else if (cmd.config.permLevel === "serverAdmin"){
            if (!message.member.permissions.has('Administrator') && (command !== "ban" || command !== "kick"))
                return message.reply({content:"you can't use this command."});
            else {
                cmd.run(client, message, args);
            }
        }
    },
};
