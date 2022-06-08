exports.run = async(client, message, args) => {
  
    let [mention, amount] = args.split(" ")
    
    const user = message.mentions.users.first();
    if (!user) return message.reply({content:"You must mention someone!"});

    const pointsToDed = parseInt(amount, 10);
    if (!pointsToDed)
        return message.reply({content:"You didn't tell me how many points to remove... :("})

    // Ensure there is a points entry for this user.
    let ensure = {}
    ensure[`${message.guild.id}`] = {
        points: 0,
        level: 0
    }

    await client.peopleData.ensure(`${user.id}`, ensure);

    // Get their current points.
    let userPoints = await client.peopleData.get(`${user.id}.${message.guild.id}.points`);
    userPoints -= pointsToDed;

    // And we save it!
    await client.peopleData.set(`${user.id}.${message.guild.id}.points`, userPoints)

    // Calculate the user's current level
    const curLevel = Math.floor(0.1 * Math.sqrt(await client.peopleData.get(`${user.id}.${message.guild.id}.points`)));

    // Act upon level up by sending a message and updating the user's level in enmap.
    if (await client.peopleData.get(`${user.id}.${message.guild.id}.level`) < curLevel) {
        message.channel.send({content:`<@${user.id}> leveled up to level **${curLevel}**! :)`});
        await client.peopleData.set(`${user.id}.${message.guild.id}.level`, curLevel);
    }
    if (await client.peopleData.get(`${user.id}.${message.guild.id}.level`) > curLevel) {
        message.channel.send({content:`<@${user.id}> leveled down to level **${curLevel}** :(`});
        await client.peopleData.set(`${user.id}.${message.guild.id}.level`, curLevel);
    }
    if (await client.peopleData.get(`${user.id}.${message.guild.id}.level`) === await client.serverData.get(`${message.guild.id}.prestigeLevel`)) {
        const rankRole = await client.serverData.get(`${message.guild.id}.prestigeRole`)
        if (!rankRole){}
        else{
            message.member.roles.add(rankRole).catch(console.error)
        }
    }

    message.channel.send({content:`${user.tag} has lost ${pointsToDed} points and now stands at ${userPoints} points.`});
}

exports.config = {
	guildOnly: true,
	aliases: ["deduct"],
	permLevel: "modAssist",
	name: "takeaway",
	description: "Remove points from a user",
	usage: ["[<@user>] [<points>]"]
};