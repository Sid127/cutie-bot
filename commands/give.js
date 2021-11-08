exports.run = async(client, message, args) => {

    let [mention, amount] = args.split(" ")

    const user = message.mentions.users.first();
    if (!user) return message.reply({content:"You must mention!"});

    const pointsToAdd = parseInt(amount, 10);
    if (!pointsToAdd)
        return message.reply({content:"You didn't tell me how many points to give... :("})

    // Ensure there is a points entry for this user.
    await client.peopleData.ensure(`${message.guild.id}-${user.id}`, {
        user: message.author.id,
        guild: message.guild.id,
        points: 0,
        level: 0
    });

    // Get their current points.
    let userPoints = await client.peopleData.get(`${message.guild.id}-${user.id}.points`);
    userPoints += pointsToAdd;


    // And we save it!
    await client.peopleData.set(`${message.guild.id}-${user.id}.points`, userPoints)

    message.channel.send({content:`${user.tag} has received ${pointsToAdd} points and now stands at ${userPoints} points.`});
}

exports.config = {
	guildOnly: true,
	aliases: ["reward"],
	permLevel: "modAssist",
	name: "give",
	category: "Modmin",
	description: "Reward points to a user",
	usage: ["[<@user>] [<number of points>]"]
};
