const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  config: {
    guildOnly: true,
    permLevel: "User",
  },
  data: new SlashCommandBuilder()
    .setName('pfp')
    .setDescription("Get a user's profile picture. If no user is mentioned, get yours")
    .addUserOption(option =>
      option.setName('user')
        .setDescription('Member whose pfp you want')
        .setRequired(false)),
  async execute(interaction, client) {
    let member = interaction.options.getMember('user') || interaction.member.user;
    console.log(member);
    interaction.reply(member.avatarURL() || `https://cdn.discordapp.com/avatars/${member.id}/${member.avatar}.webp`);
  }
};
