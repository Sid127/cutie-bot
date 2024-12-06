const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    config: {
        guildOnly: true,
        permLevel: "serverAdmin",
    },
    data: new SlashCommandBuilder()
        .setName('say')
        .setDescription('Give a user access to the rest of the server')
        .addChannelOption(option =>
            option.setName('channel')
                .setDescription('Channel to post in')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('text')
                .setDescription('The stuff to say')
                .setRequired(true)),
    async execute(interaction, client) {
        let checkChannel = interaction.options.getChannel('channel').id

        interaction.guild.channels.cache.get(checkChannel).sendTyping();
        let timeout = interaction.options.getString('text').length * 250
        setTimeout(() => {
            client.channels.cache.get(checkChannel).send({content:`${interaction.options.getString('text')}`}).then((message) => {
            });
        }, timeout)
        interaction.reply({content: "Words have been spoken", ephemeral: true});
    }
}
