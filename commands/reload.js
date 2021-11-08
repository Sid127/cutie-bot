exports.run = (client, message, args) => {
    if(!args || args.length < 1) return message.channel.send({content:"Must provide a command name to reload."});
    var commandName = args;
    // Check if the command exists and is valid
    if(!client.commands.has(commandName)) {
      if (client.aliases.has(commandName)){
        commandName = client.commands.get(client.aliases.get(commandName)).config.name;
      } else {
        return message.channel.send({content:"That command does not exist"});
      }
    }
    // the path is relative to the *current folder*, so just ./filename.js
    delete require.cache[require.resolve(`./${commandName}.js`)];
    // We also need to delete and reload the command from the client.commands Map
    client.commands.delete(commandName);
    const props = require(`./${commandName}.js`);
    client.commands.set(commandName, props);
    message.channel.send({content:`The command ${commandName} has been reloaded`});
}

exports.config = {
	guildOnly: true,
	aliases: [],
	permLevel: "botAdmin",
	name: "reload",
	category: "Console",
	description: "Reload a command to incorporate new changes",
	usage: ["[<command name>]"]
};
