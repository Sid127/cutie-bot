exports.run = async(client, message, args) => {
    // Let's clean up the database of all "old" users,
    // and those who haven't been around for... say a month.

    // Get a filtered list (for this guild only).
    const filtered = await client.points.filter(p => p.guild === message.guild.id);

    // We then filter it again (ok we could just do this one, but for clarity's sake...)
    // So we get only users that haven't been online for a month, or are no longer in the guild.
    const toRemove = filtered.filter(data => {
        return !message.guild.members.cache.has(data[1].user);
    });

    for(let i = 0; i < toRemove.length; i++) {
        // await client.points.delete(`${message.guild.id}-${toRemove[i][1].user}`);
        await client.birthdays.delete(`${message.guild.id}-${toRemove[i][1].user}`);
    };

    message.channel.send({content:`I've cleaned up ${toRemove.length} old farts.`});
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
	description: "Clean up database for this guild",
	usage: "cleanup"
};