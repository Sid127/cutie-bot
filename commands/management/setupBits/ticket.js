exports.run = async(client, message) => {
    const { MessageEmbed } = require("discord.js")
    let channel = message.mentions.channels.first();
    if (!channel) return message.reply({content:"You silly goose that's not how you do it"});
    let embed = new MessageEmbed()
        .setTitle("Tickets")
        .setDescription("By reacting to this post, a ticket channel will open for you")
    .setColor(0xffd1dc)
    let sent = await channel.send({embeds:[embed]});
    sent.react('🎫');
    await client.serverData.set(`${message.guild.id}.ticket`, sent.channel.id);
    message.channel.send({content:"Ticket system setup done!"})
}