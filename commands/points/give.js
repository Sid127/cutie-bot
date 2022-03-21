exports.run = async(client, message, args) => {

    let [mention, amount] = args.split(" ")

    if(amount.startsWith("-")) return message.channel.send("No negatives allowed, fren. Use the takeaway command.")

    const user = message.mentions.users.first();
    if (!user) return message.reply({content:"You must mention!"});

    const pointsToAdd = parseInt(amount, 10);
    if (!pointsToAdd)
        return message.reply({content:"You didn't tell me how many points to give... :("})

    // Ensure there is a points entry for this user.
    await client.peopleData.ensure(`${message.guild.id}-${user.id}`, {
        user: user.id,
        guild: message.guild.id,
        points: 0,
        level: 0
    });

    // Get their current points.
    let userPoints = await client.peopleData.get(`${message.guild.id}-${user.id}.points`);
    userPoints += pointsToAdd;


    // And we save it!
    await client.peopleData.set(`${message.guild.id}-${user.id}.points`, userPoints)

    // Calculate the user's current level
    const curLevel = Math.floor(0.1 * Math.sqrt(await client.peopleData.get(`${message.guild.id}-${user.id}.points`)));

    // Act upon level up by sending a message and updating the user's level in enmap.
    if (await client.peopleData.get(`${message.guild.id}-${user.id}.level`) < curLevel) {
        message.channel.send({content:`<@${user.id}> leveled up to level **${curLevel}**! :)`});
        await client.peopleData.set(`${message.guild.id}-${user.id}.level`, curLevel);
    }
    if (await client.peopleData.get(`${message.guild.id}-${user.id}.level`) > curLevel) {
        message.channel.send({content:`<@${user.id}> leveled down to level **${curLevel}** :(`});
        await client.peopleData.set(`${message.guild.id}-${user.id}.level`, curLevel);
    }
    if (await client.peopleData.get(`${message.guild.id}-${user.id}.level`) === await client.serverData.get(`${message.guild.id}.prestigeLevel`)) {
        const rankRole = await client.serverData.get(`${message.guild.id}.prestigeRole`)
        if (!rankRole){}
        else{
            message.member.roles.add(rankRole).catch(console.error)
        }
    }

    message.channel.send({content:`${user.tag} has received ${pointsToAdd} points and now stands at ${userPoints} points.`});
}

exports.config = {
	guildOnly: true,
	aliases: ["reward"],
	permLevel: "modAssist",
	name: "give",
	description: "Reward points to a user",
	usage: ["[<@user>] [<number of points>]"]
};
