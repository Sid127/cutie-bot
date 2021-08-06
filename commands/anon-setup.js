exports.run = async(client, message, args) => {
    const { Client, MessageEmbed } = require('discord.js');

    if (!message.member.permissions.has('ADMINISTRATOR'))
        return message.reply({content:"you can't use this command."});

    let channel = message.mentions.channels.first();
    let confessChnl = channel.id;
    if (!channel) return message.reply({content:"Usage: `anon-setup #channel`"});

    const key = `${message.guild.id}`

    await client.settings.set(`${key}.anonChnl`, confessChnl);

    const setChannel = `${client.config.prefix} anon ${key} [message]`
    const embed = new MessageEmbed()
        .setColor(0xffd1dc)
        .setDescription(`Anonymous channel set to <#${channel.id}>. DM me a message like this:` + `

${setChannel}`)
    message.channel.send({embeds: [embed]})
}

exports.conf = {
	enabled: true,
	guildOnly: true,
	aliases: [],
	permLevel: "Modmin"
};

exports.help = {
	name: "anon-setup",
	category: "Modmin",
	description: "Set up a channel for anonymous messaging",
	usage: "anon-setup [#channel]"
};