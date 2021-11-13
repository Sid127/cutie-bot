exports.run = (client, message, args) => {
    if(!args || args.length < 1) return message.channel.send({content:"Must provide a command name to reload."});
    var commandName = args;

    let category = client.commands.get(commandName).config.category.toLowerCase()

    // Check if the command exists and is valid
    if(!client.commands.has(commandName)) {
      if (client.aliases.has(commandName)){
        commandName = client.commands.get(client.aliases.get(commandName)).config.name;
        let category = client.commands.get(client.aliases.get(commandName)).config.category.toLowerCase()
      } else {
        return message.channel.send("I DUNNO WHAT COMMAND YOU WANNA RELOAD D:")
      }
    }

    // the path is relative to the *current folder*, so just ./filename.js
    delete require.cache[require.resolve(`../${category}/${commandName}.js`)];
    // We also need to delete and reload the command from the client.commands Map
    client.commands.delete(commandName);
    const props = require(`../${category}/${commandName}.js`);
    props.config.category = category.replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase());
    client.commands.set(commandName, props);
    
    message.react('☑️')
}

exports.config = {
	guildOnly: true,
	aliases: [],
	permLevel: "botAdmin",
	name: "reload",
	description: "Reload a command to incorporate new changes",
	usage: ["[<command name>]"]
};
