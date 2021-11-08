exports.run = async(client, message, args) => {
  
    let [mention, amount] = args.split(" ")
    
    const user = message.mentions.users.first();
    if (!user) return message.reply({content:"You must mention someone!"});

    const pointsToDed = parseInt(amount, 10);
    if (!pointsToDed)
        return message.reply({content:"You didn't tell me how many points to remove... :("})

    // Ensure there is a points entry for this user.
    await client.peopleData.ensure(`${message.guild.id}-${user.id}`, {
        user: user.id,
        guild: message.guild.id,
        points: 0,
        level: 0
    });

    // Get their current points.
    let userPoints = await client.peopleData.get(`${message.guild.id}-${user.id}.points`);
    userPoints -= pointsToDed;

    // And we save it!
    await client.peopleData.set(`${message.guild.id}-${user.id}.points`, userPoints)

    message.channel.send({content:`${user.tag} has lost ${pointsToDed} points and now stands at ${userPoints} points.`});
}

exports.config = {
	guildOnly: true,
	aliases: ["deduct"],
	permLevel: "modAssist",
	name: "takeaway",
	category: "Points",
	description: "Remove points from a user",
	usage: ["[<@user>] [<points>]"]
};