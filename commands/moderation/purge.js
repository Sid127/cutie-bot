const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');

module.exports = {
    config: {
      guildOnly: true,
      permLevel: "modAssist",
    },
    data: new SlashCommandBuilder()
    .setName('purge')
    .setDescription('Bulk delete messages')
    .addNumberOption(option =>
        option.setName('messages')
            .setDescription('Number of messages to delete')
            .setRequired(true)
            .setMinValue(1)
            .setMaxValue(100)),
    async execute(interaction, client) {
        interaction.reply(`Deleting messages, just a sec...`)
        const amount = interaction.options.getNumber('messages'); // Amount of messages which should be deleted
        await interaction.channel.messages.fetch({ limit: amount }).then(messages => { // Fetches the messages

            interaction.channel.bulkDelete(messages, true) // Bulk deletes all messages that have been fetched and are not older than 14 days (due to the Discord API)
                .then((msgs) => interaction.editReply(`Deleted ${msgs.size} messages`))
                .catch(() => interaction.editReply("Hey, some of the messages in this range are older than 14 days, delete those manually, thanks!"));

        });

        const sendChnl = await client.serverData.get(`${key}.logChnl`)

        if(!sendChnl) {} else {
            const embed = new EmbedBuilder()
                .setColor(0xffd1dc)
                .setTitle(`${amount} messages deleted in <#${interaction.channelId}>`)
                .addFields({name: `Purge initiated by`, value: `${interaction.user.username || 'Unknown D:'}`})
                .setTimestamp();

            client.channels.cache.get(sendChnl).send({embeds: [embed]})
        }
    }
}
