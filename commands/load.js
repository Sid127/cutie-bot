exports.run = (client, message, args) => {
    if(!args || args.length < 1) return message.channel.send({content:"Must provide a command name to load."});
    const commandName = args;

    // the path is relative to the *current folder*, so just ./filename.js
    delete require.cache[require.resolve(`./${commandName}.js`)];
    // We also need to delete and reload the command from the client.commands Map
    const props = require(`./${commandName}.js`);
    if (!props) return message.channel.send ({content:"That command hasn't been written yet"})
    client.commands.set(commandName, props);
    message.channel.send({content:`The command ${commandName} has been loaded`});
  }

exports.config = {
    enabled: true,
    guildOnly: true,
    aliases: [],
    permLevel: "botAdmin",
    name: "load",
    category: "Console",
    description: "Load a command to incorporate new changes",
    usage: ["[<command name>]"]
};
