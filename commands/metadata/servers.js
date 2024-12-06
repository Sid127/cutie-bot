const { codeBlock, SlashCommandBuilder } = require("discord.js");
const { splitMessage } = require("../../functionFiles/helperFunctions.js")

module.exports = {
  config: {
    guildOnly: true,
    permLevel: "botAdmin",
  },
  data: new SlashCommandBuilder()
    .setName('servers')
    .setDescription("Show basic server info for all the servers I'm in"),
  async execute(interaction, client) {
    // variables for different things used
    let longestName = 0;
    let guilds = {};

    client.guilds.cache.forEach(guild => {
      // check for the longest name
      longestName = Math.max(longestName, guild.name.length);
      // add guild to list
      guilds[guild.name] = `${guild.id} :: ${guild.memberCount} members`;
    });

    // create the "header" for the message
    let output = (`== Server List ==\n` +
    `Here's a list of all the servers I'm in:\n * ${Object.keys(guilds).length} servers served *\n\n`);

    // loop through all the guilds, add padding for all to be same length
    for (g of Object.keys(guilds).sort()) {
      output += `${g.padEnd(longestName, " ")} :: ${guilds[g]}\n`
    }

    let splitOutput = splitMessage(output, {maxLength: 1900, char: "\u200b"});
    for (let chunk of splitOutput) {
      await interaction.reply(codeBlock("asciidoc", chunk.trim()));
    }
  }
};
