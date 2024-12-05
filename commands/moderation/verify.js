const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    config: {
        guildOnly: true,
        permLevel: "modAssist",
    },
    data: new SlashCommandBuilder()
        .setName('verify')
        .setDescription('Give a user access to the rest of the server')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('User to verify')
                .setRequired(true))
        .addBooleanOption(option =>
            option.setName('adult')
                .setDescription('Whether the user gets the 18+ role')
                .setRequired(false)),
    async execute(interaction, client) {
        let verifyMember = interaction.options.getUser('user');

        let autorole = await client.serverData.get(`${message.guild.id}.autoRole`)

        if(autorole && autorole.length !== 0){
            for (role of autorole){
                verifyMember.roles.remove(role).catch(console.error);
            }
        }

        let verifyroles = await client.serverData.get(`${message.guild.id}.verifyRole`)
        if(!Array.isArray(verifyroles) || verifyroles.length === 0) return interaction.reply("There's no roles set up yet!")

        for (role of verifyroles){
            verifyMember.roles.add(role).catch(console.error);
        }

        if (interaction.options.getBoolean('adult') === true) {
            let ageroles = await client.serverData.get(`${message.guild.id}.verify18Role`)
            for (role of ageroles){
                verifyMember.roles.add(role).catch(console.error);
            }
        }

        interaction.reply("Member verified :D")
    }
}
