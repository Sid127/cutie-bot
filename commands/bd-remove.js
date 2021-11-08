exports.run = async(client, message) => {
    await client.peopleData.delete(`${message.guild.id}-${message.author.id}`);
    message.channel.send({content:"I no longer know your birthday :("})
}

exports.config = {
	guildOnly: true,
	aliases: ["bd-rm"],
	permLevel: "User",
	name: "bd-remove",
	category: "Birthdays",
	description: "Removes your birthday from the bot",
	usage: []
};