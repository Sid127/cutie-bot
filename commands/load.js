exports.run = (client, message, args) => {
    if (message.member.permissions.has('ADMINISTRATOR')) {
      if(!args || args.length < 1) return message.channel.send({content:"Must provide a command name to load."});
      const commandName = args[0];

      // the path is relative to the *current folder*, so just ./filename.js
      delete require.cache[require.resolve(`./${commandName}.js`)];
      // We also need to delete and reload the command from the client.commands Map
      const props = require(`./${commandName}.js`);
      if (!props) return message.channel.send ({content:"That command hasn't been written yet"})
      client.commands.set(commandName, props);
      message.channel.send({content:`The command ${commandName} has been loaded`});
    } else {
      message.channel.send({content:"I'm sure you didn't create me"});
    }
  }

  exports.conf = {
      enabled: true,
      guildOnly: true,
      aliases: [],
      permLevel: "Modmin"
  };

  exports.help = {
      name: "load",
      category: "Modmin",
      description: "Load a command to incorporate new changes",
      usage: "load [command name]"
  };
