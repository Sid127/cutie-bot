exports.run = async (client, message, args) => {
    const { MessageEmbed } = require("discord.js")

    if(args[0] === "off") {
        await client.serverData.set(`${message.guild.id}.logChnl`, null);
        return message.channel.send({content:"Audit log channel unset"})
    }

    //grb channel metadata
    let channel = message.mentions.channels.first();
    if (!channel) return message.reply({content:"You silly goose that's not how you do it"});
    let loggerChnl = channel.id;

    //push data to mongo
    await client.serverData.set(`${message.guild.id}.logChnl`, loggerChnl);

    //confirm it to the user
    let embed = new MessageEmbed()
        .setColor(0xffd1dc)
        .setDescription(`Logs channel set to <#${channel.id}>.`)
    message.channel.send({embeds:[embed]})
}