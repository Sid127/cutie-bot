module.exports = {
    name: "messageCreate",
    async execute(message, client) {
        // Ignore all bots
        if (message.author.bot) return;

        // If this is not in a DM, execute the code.
        if (message.guild) {
            // We'll use the key often enough that simplifying it is worth the trouble.
            const key = `${message.guild.id}-${message.author.id}`;

            await client.serverData.ensure(`botSettings`,{
                botadmin: ["319391726613823489", "283607841779089409"]
            });

            if(client.cache[message.guild.id].activityLeaderboard === "enabled"){
                // Triggers on new users we haven't seen before.
                await client.peopleData.ensure(`${message.guild.id}-${message.author.id}`, {
                    user: message.author.id,
                    guild: message.guild.id,
                    points: 0,
                    level: 0,
                });

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

            //define prefix
            message.guild ? (client.cache[message.guild.id].prefix === "" ? client.prefix = client.config.prefix : client.prefix = client.cache[message.guild.id].prefix) : client.prefix = client.config.prefix

            // Ignore messages not starting with the prefix
            if (!message.content.toLowerCase().trim().startsWith(client.prefix)) return;

            // Define command and the rest of the text in the message
            let [command, ...args] = message.content.slice(client.prefix.length).trim().split(/ +/g);
            // From command slice out prefix length and force lowercase while just joining args together to a string with spaces (since split by them)
            command = command.toLowerCase();
            args = args.join(" ").trim();

            // if command is a server custom command, send the response
            if(client.cache[message.guild.id].cc.includes(command))
                return message.channel.send(await client.serverData.get(`${message.guild.id}.customCommands.${command}`))

            // Grab the command data from the client.commands Map
            let cmd = client.commands.get(command) || client.commands.get(client.aliases.get(command));

            //grab our cache of disabled modules for this server
            let enabledModules = client.cache[message.guild.id].enabledModules

            if (!enabledModules.includes(cmd.config.category.toLowerCase()))
                return message.channel.send("The module for that command has been disabled! Ask a server admin to enable it :3")
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

        // Grab the command data from the client.commands Map
        let cmd = client.commands.get(command) || client.commands.get(client.aliases.get(command));

        // If that command doesn't exist, silently exit and do nothing
        if (!cmd) return;

        // Check perm level and run the command
        if (client.cache.botSettings.botadmin.includes(`${message.author.id}`)){
            cmd.run(client, message, args);
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
