exports.run = async(client, message, args) => {
    const { Client, MessageEmbed } = require('discord.js');

    if (!message.member.permissions.has('ADMINISTRATOR'))
        return message.reply({content:"you can't use this command."});

    let channel = message.mentions.channels.first();
    let loggerChnl = channel.id;

    const key = `${message.guild.id}`

    await client.settings.set(`${key}.logChnl`, loggerChnl);

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
	permLevel: "Modmin"
};

exports.help = {
	name: "logger",
	category: "Modmin",
	description: "Sets up an audit log in a specified channel",
	usage: "logger [#channel]"
};