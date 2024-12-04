function generateRandom(min = 0, max = 100) {
  return Math.floor(Math.random() * (max - min)) + min;
}

const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  config: {
    guildOnly: true,
    permLevel: "User",
  },
  data: new SlashCommandBuilder()
  .setName('randomaddress')
  .setDescription('Give a randomized portal address as Hexadecimals'),
  async execute(interaction) {
    /*
     *    P * SSS YY ZZZ XXX
     *
     *    P = planet index (0 -> 6)
     *    S = system index (0 -> 4096)
     *
     *    coords are for region coords (400ly³ chunks)
     *    Y = y coord (01 -> FF)
     *    Z = z coord (001 -> FFF)
     *    X = x coord (001 -> FFF)
     *
     */
    let details = {
      planetIndex: "1",
      systemIndex: generateRandom(1, 4095).toString(16).padStart(3, '0').toUpperCase(),
      Ycoord: generateRandom(1, 255).toString(16).padStart(2, '0').toUpperCase(),
      Zcoord: generateRandom(1, 4095).toString(16).padStart(3, '0').toUpperCase(),
      Xcoord: generateRandom(1, 4095).toString(16).padStart(3, '0').toUpperCase()
    }

    interaction.reply(`The random portal address you asked for is: ` +
    `\`${details.planetIndex}${details.systemIndex}${details.Ycoord}${details.Zcoord}${details.Xcoord}\``);

  }
};
