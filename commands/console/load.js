exports.run = (client, message, args) => {
    if(!args || args.length < 1) return message.channel.send({content:"Must provide a command name to load."});
    const commandName = args;
    const fs = require('fs')

    if(!fs.existsSync(`./${commandName}.js`)) return message.channel.send ({content:"That command hasn't been written yet"})

    // We also need to delete and reload the command from the client.commands Map
    const props = require(`./${commandName}.js`);
    client.commands.set(commandName, props);
    message.react('☑️')
  }

exports.config = {
    enabled: true,
    guildOnly: true,
    aliases: [],
    permLevel: "botAdmin",
    name: "load",
    description: "Load a command to incorporate new changes",
    usage: ["[<command name>]"]
};
