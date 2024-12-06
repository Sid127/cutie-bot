const status = {
    online: "Online",
    idle: "Idle",
    dnd: "Do Not Disturb",
    offline: "Offline/Invisible",
    0: "Playing",
    1: "Streaming",
    2: "Listening",
    3: "Watching",
    4: "Custom",
    5: "Competing"
};

const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");
const moment = require("moment-timezone");

module.exports = {
    config: {
        guildOnly: true,
        permLevel: "User",
    },
    data: new SlashCommandBuilder()
        .setName('info')
        .setDescription('Get info about a server or a user')
        .addSubcommand(subcommand =>
            subcommand.setName('user')
                .setDescription('Info about a user')
                .addUserOption(option => option.setName('target')
                    .setDescription('The user to get info about')
                    .setRequired(false)))
        .addSubcommand(subcommand =>
            subcommand.setName('server')
                .setDescription('Info about the server')
                .addStringOption(option => option.setName('target')
                    .setDescription('The server ID to get info about')
                    .setRequired(false))),
    async execute(interaction, client) {
        if (interaction.options.getSubcommand() === 'user') {
            // set the member object to get the info from, if a user was tagged, prioritize that
            let member = interaction.options.getMember('target') || interaction.member;

            // build the embed
            let embed = new EmbedBuilder()
                .setColor("Random")
                .setThumbnail(`${member.user.avatar != null ? member.user.avatarURL() : "https://discordapp.com/assets/dd4dbc0016779df1378e7812eabaa04d.png"}`, true)
                .setTitle(`${member.nickname ? `${member.nickname} (${member.user.tag})` : member.user.tag}`)
                .addFields(
                    { inline: true, name: "Status", value: `${member.presence ? status[member.presence.status] : "I have no idea D:"}` },
                    { inline: true, name: "Roles", value: `${member.roles.cache.filter(role => role.id !== role.guild.id).map(roles => `\`${roles.name}\``).join(" **|** ") || "No roles to show."}` },
                    { name: "Guild joined", value: `<t:${moment(member.joinedAt).unix()}:F> \n${moment().diff(moment.utc(member.joinedAt), 'days')} Days Ago.` },
                    { name: "Account created", value: `<t:${moment(member.user.createdAt).unix()}:F> \n${moment().diff(moment.utc(member.user.createdAt), 'days')} Days Ago.` })

            // create activities object if available
            if (member.presence) {
                let activities = member.presence.activities.filter(elem => elem.type !== 4)
                for (activity of activities) {
                    activity !== undefined ? embed.addFields({ name: status[activity.type], value: `${activity.name}\n\`${activity.details}\n${activity.state}\``, inline: true}) : {}
                }
            }

            interaction.reply({embeds:[embed]});
        } else if (interaction.options.getSubcommand() === 'server') {
            let server;
            let serverOwner;
            if (client.hardcoded.botAdmin.includes(`${interaction.user.id}`)){
                server = client.guilds.cache.get(interaction.options.getString('target'));
                if (!server){
                    server = interaction.guild;
                    console.log(server)
                    serverOwner = await interaction.guild.fetchOwner();
                } else { serverOwner = await client.guilds.cache.get(interaction.options.getString('target')).fetchOwner(); }
            } else {
                server = interaction.guild;
                serverOwner = await interaction.guild.fetchOwner();
            }

            // build the embed
            // since v14 changed channel types again, chenc numbers from: https://discord.com/developers/docs/resources/channel#channel-object-channel-types
            let embed = new EmbedBuilder()
                .setColor("Random")
                .setThumbnail(`${server.icon != null ? server.iconURL() : "https://discordapp.com/assets/dd4dbc0016779df1378e7812eabaa04d.png"}`)
                .setAuthor(server)
                .addFields(
                      { name: "Owner", value: `${serverOwner.user.username}`},
                      { inline: true, name: "Member Count", value: `${server.memberCount}`},
                      { inline: true, name: "Emoji Count", value: `${server.emojis.cache.size}`},
                      { inline: true, name: "Roles Count", value: `${server.roles.cache.size}`},
                      { inline: true, name: "Text Channels", value: `${server.channels.cache.filter((c) => [0, 5].includes(c.type)).size}`},
                      { inline: true, name: "Voice Channels", value: `${server.channels.cache.filter((c) => [2, 13].includes(c.type)).size}`},
                      { inline: true, name: "Forum Channels", value: `${server.channels.cache.filter((c) => [15].includes(c.type)).size}`},
                      { inline: true, name: "Threads", value: `${server.channels.cache.filter((c) => [10, 11, 12].includes(c.type)).size}`},
                      { inline: true, name: "Created On", value: `<t:${moment(server.createdAt).unix()}>, <t:${moment(server.createdAt).unix()}:R>`},)

            interaction.reply({embeds:[embed]});
        }
    }
}
