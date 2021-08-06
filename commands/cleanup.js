exports.run = async(client, message, args) => {
    // Let's clean up the database of all "old" users,
    // and those who haven't been around for... say a month.

    // Get a filtered list (for this guild only).
    const filtered = await client.points.filter(p => p.guild === message.guild.id);

    // We then filter it again (ok we could just do this one, but for clarity's sake...)
    // So we get only users that haven't been online for a month, or are no longer in the guild.
    const rightNow = new Date();
    const toRemove = filtered.filter(data => {
        return !message.guild.members.cache.has(data.user) || rightNow - 2592000000 > data.lastSeen;
    });

    toRemove.forEach = async(data) => {
        await client.points.delete(`${message.guild.id}-${data.user}`);
    };

    message.channel.send({content:`I've cleaned up ${toRemove.size} old farts.`});
}

exports.conf = {
	enabled: true,
	guildOnly: true,
	aliases: [],
	permLevel: "Modmin"
};

exports.help = {
	name: "cleanup",
	category: "Modmin",
	description: "Clean up the leaderboard",
	usage: "cleanup"
};