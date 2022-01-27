exports.run = async (client, message, args) => {
    if(!args || args.length < 1) return message.channel.send({content:"Must provide a command name to load."});
    let [commandName, category] = args.split(" ");
    const fs = require('fs')

    fs.access(`${__dirname}/../${category}/${commandName}.js`, (err) => {
      if (err) {
        message.channel.send("That file doesn't exist yet D:")
      } else {
        const props = require(`${__dirname}/../${category}/${commandName}.js`);
        props.config.category = category;

        // We also need to load the command into the client.commands Map
        client.commands.set(commandName, props);
        message.react('☑️')
      }
  });
}

exports.config = {
    enabled: true,
    guildOnly: true,
    aliases: [],
    permLevel: "botAdmin",
    name: "load",
    description: "Load a command to incorporate new changes",
    usage: ["[<command name>] [<module name>]"]
};
