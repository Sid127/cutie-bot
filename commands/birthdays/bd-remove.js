exports.run = async(client, message) => {
	if(!await client.peopleData.has(`${message.author.id}.date`)) return message.channel.send("I don't remember you telling me your birthday to begin with")
    await client.peopleData.set(`${message.author.id}.${message.guild.id}.bdayEnabled`, false);
	message.channel.send({content:"I'll no longer wish you on your birthday here :("})
}

exports.config = {
	guildOnly: true,
	aliases: ["bd-rm"],
	permLevel: "User",
	name: "bd-remove",
	description: "Removes your birthday from the bot",
	usage: []
};