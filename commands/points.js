exports.run = async(client, message, [mention]) => {
    if (message.mentions.members.size === 0) {
        const key = `${message.guild.id}-${message.author.id}`;
        const point = await client.peopleData.get(`${key}.points`);
        if (point === null) return message.channel.send("Nothing to see here, move on")
        const lvl = await client.peopleData.get(`${key}.level`);
        return await message.reply({content:`you currently have ${point} points, and are level ${lvl}!`});
    } else if (message.mentions.members.size === 1) {
        const keyMember = message.mentions.members.first();
        const key = `${message.guild.id}-${keyMember.id}`;
        const point = await client.peopleData.get(`${key}.points`);
        if (point === null) return message.channel.send("Nothing to see here, move on")
        const lvl = await client.peopleData.get(`${key}.level`);
        return await message.channel.send({content:`${keyMember.displayName} currently has ${point})} points, and is level ${lvl}!`});
    }
}

exports.config = {
	guildOnly: true,
	aliases: [],
	permLevel: "User",
	name: "points",
	category: "Miscellaneous",
	description: "Check a user's points. If no user is mentioned, check yours",
	usage: ["(<@user>)"]
};