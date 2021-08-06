exports.run = async(client, message, args) => {
    // ticket-setup #channel
    const Discord = require("discord.js");

    if (!message.member.permissions.has('MANAGE_CHANNELS'))
        return message.reply({content:"you can't use this command."});

    let channel = message.mentions.channels.first();
    if (!channel) return message.reply({content:"Usage: `ticket-setup #channel`"});
    let embed = new Discord.MessageEmbed()
        .setTitle("Tickets")
        .setDescription("By reacting to this post, a ticket channel will open for you")
       .setColor(0xffd1dc)
    let sent = await channel.send({embeds:[embed]});
    sent.react('🎫');
    await client.settings.set(`${message.guild.id}-ticket`, sent.id);
    message.channel.send({content:"Ticket system setup done!"})
}

exports.conf = {
	enabled: true,
	guildOnly: true,
	aliases: [],
	permLevel: "Modmin"
};

exports.help = {
	name: "ticket-setup",
	category: "Modmin",
	description: "Setup Ticket channels",
	usage: "ticket-setup [#channel]"
};