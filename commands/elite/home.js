exports.run = async(client, message) => {
    const { Client, MessageEmbed } = require('discord.js');

    //grab data from mongo
    let homeInfo = await client.serverData.get(`${message.guild.id}.home`)
    if(!homeInfo) return message.channel.send("You know you have to set that up first, right?")

    let embed = new MessageEmbed()
        .setTitle(`${homeInfo.homeSys}${homeInfo.homeStation ? `, ${homeInfo.homeStation}` : ""}`)
        .setAuthor(message.guild)
        .setColor('RANDOM');

    //add additional data if required
    homeInfo.encTrd ? embed.addField(`Nearest Encoded Material Trader`, `${homeInfo.encTrd}`) : ""
    homeInfo.manfTrd ? embed.addField(`Nearest Manufactured Material Trader`, `${homeInfo.manfTrd}`) : ""
    homeInfo.rawTrd ? embed.addField(`Nearest Raw Material Trader`, `${homeInfo.rawTrd}`) : ""
    homeInfo.grdBrk ? embed.addField(`Nearest Guardian Tech Broker`, `${homeInfo.grdBrk}`) : ""
    homeInfo.hmnBrk ? embed.addField(`Nearest Human Tech Broker`, `${homeInfo.hmnBrk}`) : ""
    homeInfo.iF ? embed.addField(`Nearest Interstellar Factor`, `${homeInfo.iF}`) : ""
    homeInfo.fcv ? embed.addField(`Nearest Fleet Carrier Vendor`, `${homeInfo.fcv}`) : ""
    homeInfo.fca ? embed.addField(`Nearest Fleet Carrier Administrator`, `${homeInfo.fca}`) : ""

	message.channel.send({embeds:[embed]});

};

exports.config = {
	guildOnly: true,
	aliases: ["homes"],
	permLevel: "User",
	name: "home",
	description: "Shows Home System Information",
	usage: []
};
