exports.run = async(client, message, [mention]) => {
    if (message.mentions.members.size === 0) {
        const key = `${message.guild.id}-${message.author.id}`;
        const point = await client.points.get(`${key}.points`);
        const lvl = await client.points.get(`${key}.level`);
        return await message.reply({content:`you currently have ${point} points, and are level ${lvl}!`});
    } else if (message.mentions.members.size === 1) {
        const keyMember = message.mentions.members.first();
        const key = `${message.guild.id}-${keyMember.id}`;
        const point = await client.points.get(`${key}.points`);
        const lvl = await client.points.get(`${key}.level`);
        return await message.channel.send({content:`${keyMember.displayName} currently has ${point})} points, and is level ${lvl}!`});
    }
}

exports.conf = {
	enabled: true,
	guildOnly: true,
	aliases: [],
	permLevel: "User"
};

exports.help = {
	name: "points",
	category: "Miscellaneous",
	description: "Check a user's points. If no user is mentioned, check yours",
	usage: "points <@user>"
};