exports.run = async(client, message) => {
    const { Client, MessageEmbed } = require('discord.js');

    // grab the mentioned channel
    let channel = message.mentions.channels.first();
    if (!channel) return message.reply({content:"Usage: `anon-setup #channel`"});
    let confessChnl = channel.id;


    // save to mongo before confirming it to the user
    const key = `${message.guild.id}`
    await client.serverData.set(`${key}.anonChnl`, confessChnl);

    // confirm it to the user with usage example
    const setChannel = `${client.config.prefix} anon ${key} [message]`
    const embed = new MessageEmbed()
        .setColor(0xffd1dc)
        .setDescription(`Anonymous channel set to <#${channel.id}>. DM me a message like this:` + `

${setChannel}`)
    client.channels.cache.get(confessChnl).send({embeds: [embed]})
}

exports.conf = {
	enabled: true,
	guildOnly: true,
	aliases: [],
	permLevel: "serverAdmin"
};

exports.help = {
	name: "anon-setup",
	category: "Modmin",
	description: "Set up a channel for anonymous messaging",
	usage: "anon-setup [#channel]"
};