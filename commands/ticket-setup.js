exports.run = async(client, message) => {
    // ticket-setup #channel
    const Discord = require("discord.js");

    let channel = message.mentions.channels.first();
    if (!channel) return message.reply({content:"Usage: `ticket-setup #channel`"});
    let embed = new Discord.MessageEmbed()
        .setTitle("Tickets")
        .setDescription("By reacting to this post, a ticket channel will open for you")
       .setColor(0xffd1dc)
    let sent = await channel.send({embeds:[embed]});
    sent.react('🎫');
    await client.serverData.set(`${message.guild.id}.ticket`, sent.id);
    message.channel.send({content:"Ticket system setup done!"})
}

exports.config = {
	guildOnly: true,
	aliases: [],
	permLevel: "serverAdmin",
	name: "ticket-setup",
	category: "Modmin",
	description: "Setup Ticket channels",
	usage: ["[<#channel>]"]
};