exports.run = async(client, message) => {
	if(await client.peopleData.get(`${message.guild.id}-${message.author.id}.date`) === null) return message.channel.send("I don't remember you telling me your birthday to begin with")
    await client.peopleData.set(`${message.guild.id}-${message.author.id}.date`, null);
    await client.peopleData.set(`${message.guild.id}-${message.author.id}.timezone`, null);
	message.channel.send({content:"I no longer know your birthday :("})
}

exports.config = {
	guildOnly: true,
	aliases: ["bd-rm"],
	permLevel: "User",
	name: "bd-remove",
	description: "Removes your birthday from the bot",
	usage: []
};