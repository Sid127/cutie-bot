exports.run = async (client, message) => {
    const { MessageEmbed } = require("discord.js")
    //create metadata
    let channel = message.mentions.channels.first();
    if (!channel) return message.reply({content:"You silly goose that's not how you do it"});
    let bgsChnl = channel.id;

    //push data to mongo
    await client.serverData.set(`${message.guild.id}.bgsChnl`, bgsChnl);

    //send a confirmation
    let embed = new MessageEmbed()
        .setColor(0xffd1dc)
        .setDescription(`BGS Tick detector set to <#${channel.id}>.`)
    message.channel.send({embeds:[embed]})
}