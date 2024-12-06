const { codeBlock, SlashCommandBuilder } = require("discord.js");
const moment = require("moment");
require("moment-duration-format");

module.exports = {
  config: {
    guildOnly: true,
    permLevel: "User",
  },
  data: new SlashCommandBuilder()
    .setName('status')
    .setDescription('Get bot uptime info'),
  async execute(interaction, client) {
    const duration = moment.duration(client.uptime).format(" D [days], H [hrs], m [mins], s [secs]");

    interaction.reply(codeBlock('asciidoc', `= Cutie Status =
    • Mem Usage  :: ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB
    • Uptime     :: ${duration}
    • Servers    :: ${client.guilds.cache.size.toLocaleString()}
    • Users      :: ${client.users.cache.size.toLocaleString()}
    • Code       :: https://gitlab.com/Sid127/cutie-bot
    = Cutie was queer coded by Sid <3 =`));
  }
};
