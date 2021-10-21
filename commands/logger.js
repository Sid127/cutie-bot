exports.run = async(client, message) => {
    const { Client, MessageEmbed } = require('discord.js');

    //grb channel metadata
    let channel = message.mentions.channels.first();
    let loggerChnl = channel.id;

    //push data to mongo
    const key = `${message.guild.id}`
    await client.serverData.set(`${key}.logChnl`, loggerChnl);

    //confirm it to the user
    const setChannel = `${client.config.prefix} anon ${key} [message]`
    const embed = new MessageEmbed()
        .setColor(0xffd1dc)
        .setDescription(`Logs channel set to <#${channel.id}>.`)
    message.channel.send({embeds:[embed]})
}

exports.conf = {
	enabled: true,
	guildOnly: true,
	aliases: [],
	permLevel: "serverAdmin"
};

exports.help = {
	name: "logger",
	category: "Modmin",
	description: "Sets up an audit log in a specified channel",
	usage: "logger [#channel]"
};