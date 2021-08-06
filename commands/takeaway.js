exports.run = async(client, message, args) => {
    // Limited to mods- adjust to your own preference!
    if (!message.member.permissions.has('VIEW_AUDIT_LOG'))
        return message.reply({content:"you can't use this command."});

    const user = message.mentions.users.first()
    if (!user) return message.reply({content:"You must mention someone!"});

    const pointsToDed = parseInt(args[1], 10);
    if (!pointsToDed)
        return message.reply({content:"You didn't tell me how many points to give... :("})

    // Ensure there is a points entry for this user.
    await client.points.ensure(`${message.guild.id}-${user.id}`, {
        user: message.author.id,
        guild: message.guild.id,
        points: 0,
        level: 0
    });

    // Get their current points.
    let userPoints = await client.points.get(`${message.guild.id}-${user.id}.points`);
    userPoints -= pointsToDed;

    // And we save it!
    await client.points.set(`${message.guild.id}-${user.id}.points`, userPoints)

    message.channel.send({content:`${user.tag} has lost ${pointsToDed} points and now stands at ${userPoints} points.`});
}

exports.conf = {
	enabled: true,
	guildOnly: true,
	aliases: ["deduct"],
	permLevel: "Modmin"
};

exports.help = {
	name: "takeaway",
	category: "Modmin",
	description: "Remove points from a user",
	usage: "takeaway [@user] [points]"
};