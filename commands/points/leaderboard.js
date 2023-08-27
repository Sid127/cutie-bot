exports.run = async(client, message, args) => {
    const { Client, EmbedBuilder } = require('discord.js');

	// Set the current guild id as a var for later use
	let guildID = message.guild.id;

    // Get a filtered list (for this guild only), and convert to an array while we're at it.
    let filtered = await client.peopleData.filter(p => p && p[guildID] && p[guildID].points);

	// Check if there's users in the filtered output, if not, no users with points => return
	if (filtered.length === 0) return message.reply("I didn't find any users with points for this server.");

    // Sort it to get the top results... well... at the top. Y'know.
    let sorted = filtered.sort((a, b) => b[1][guildID]['points'] - a[1][guildID]['points']);

	// Get the user position of args was "me"
	if (args.trim().toLowerCase() === "me") {
		let userSpot = sorted.findIndex(elem => elem[0] === `${message.author.id}`);

		return message.reply(`You're #${userSpot + 1} (on page: ${Math.ceil(filtered.length / 10)}) having gathered ${sorted[userSpot][1][guildID].points} points.`);
	}

	// Get the page from args
	let page = parseInt(args) || 1;

	// Quick check if we've managed to get some weird stuff, should never happen
	if (page < 1 || isNaN(page)) return message.reply("I've never heard of these pages, please teach me more. (give me the page number you want to be shown)");

	// Set two variables to get the splice working
    let i = page === 1 ? 0 : 10 * (page - 1);
    let j = 10 * page;

    // Slice it, dice it, get the top 10 of it!
    let split10 = sorted.splice(i, j);

	if (split10.length === 0) return message.reply(`I've not seen enough users active here to need so many pages. (last page used is: ${Math.ceil(filtered.length / 10)})`);

    // Now shake it and show it! (as a nice embed, too!)
    const embed = new EmbedBuilder()
        .setTitle("Leaderboard")
        .setAuthor({name: `${client.user.username}`})
        .setDescription(page === 1 ? "Top 10 point leaders!" : `Showing page: ${page}`)
        .setColor(0xffd1dc);

	// Loop through the entries using this way of getting index too
    for (const [index, data] of split10.entries()) {
		let member = message.guild.members.cache.get(data[0]);

		embed.addFields({name: `#${(10 * (page - 1)) + (index + 1)}: ${member.user.username}`, value: `${data[1][guildID].points} point${data[1][guildID].points === 1 ? "" : "s"} (level ${data[1][guildID].level})`});
    }

    message.channel.send({embeds: [embed] });
}

exports.config = {
	guildOnly: true,
	aliases: ["ranks"],
	permLevel: "User",
	name: "leaderboard",
	description: "Shows the current leaderboard",
	usage: ["(me)", "(<page number>)"]
};
