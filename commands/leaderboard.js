exports.run = async(client, message, args) => {
    const { Client, MessageEmbed } = require('discord.js');
    // Get a filtered list (for this guild only), and convert to an array while we're at it.
    var filtered = await client.peopleData.filter(p => p.guild === message.guild.id && p.points);

    // Sort it to get the top results... well... at the top. Y'know.
    var sorted = filtered.sort((a, b) => b[1]['points'] - a[1]['points']);

    var i = 0
    var j = 10

    // Slice it, dice it, get the top 10 of it!
    var top10 = sorted.splice(i, j);

    // Now shake it and show it! (as a nice embed, too!)
    const embed = new MessageEmbed()
        .setTitle("Leaderboard")
        .setAuthor(client.user.username, client.user.avatarURL)
        .setDescription("Our top 10 points leaders!")
        .setColor(0xffd1dc);
    for (const data of top10) {
        embed.addField(`${data[1]['username']}`, `${data[1]['points']} points (level ${data[1]['level']})`);
    }
    message.channel.send({embeds: [embed] })
}

exports.config = {
	guildOnly: true,
	aliases: ["ranks"],
	permLevel: "User",
	name: "leaderboard",
	category: "Points",
	description: "Shows the current leaderboard",
	usage: []
};