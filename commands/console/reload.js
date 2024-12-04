exports.run = async (client, message, args) => {
    if(!args || args.length < 1) return message.channel.send({content:"Must provide a command name to reload."});
	if(args === "cache"){
		let tempCache = await client.serverData.getMany(await client.serverData.keys)
	    for (key of Object.keys(tempCache)) {
	        if(!client.hardcoded.badServerDataKeys.includes(key)){
	            client.cache[key] = {}
	            client.cache[key]["enabledModules"] = tempCache[key].enabledModules
	            client.cache[key]["prefix"] = tempCache[key].prefix
	            client.cache[key]["activityLeaderboard"] = tempCache[key].activityLeaderboard
	            client.cache[key]["cc"] = Object.keys(tempCache[key].customCommands)
				client.cache[key]["reactionRoles"] = Object.keys(tempCache[key].reactionRoles)
	        }
	        client.cache.tick = tempCache.tick
	    }
		return message.channel.send("Local cache updated")
	}
	let commandName = args;
    let category = ""

    // Check if the command exists and is valid
    if(!client.commands.has(commandName) && !client.aliases.has(commandName))
        return message.channel.send("I DUNNO WHAT COMMAND YOU WANNA RELOAD D:")

    client.commands.has(commandName) ? category = client.commands.get(commandName).config.category : (category = client.commands.get(client.aliases.get(commandName)).config.category, commandName = client.commands.get(client.aliases.get(commandName)).config.name)

    // the path is relative to the *current folder*, so just ./filename.js
    delete require.cache[require.resolve(`../${category}/${commandName}.js`)];
    // We also need to delete and reload the command from the client.commands Map
    client.commands.delete(commandName);
    const props = require(`../${category}/${commandName}.js`);
    props.config.category = category;
    client.commands.set(commandName, props);

    message.react('☑️')
}

exports.config = {
	guildOnly: true,
	aliases: ["rl"],
	permLevel: "botAdmin",
	name: "reload",
	description: "Reload a command to incorporate new changes",
	usage: ["[<command name>]"]
};
