exports.run = async(client, message) => {
    await client.peopleData.delete(`${message.guild.id}-${message.author.id}`);
    message.channel.send({content:"I no longer know your birthday :("})
}

exports.conf = {
	enabled: true,
	guildOnly: true,
	aliases: ["bd-rm"],
	permLevel: "User"
};

exports.help = {
	name: "bd-remove",
	category: "Birthdays",
	description: "Removes your birthday from the bot",
	usage: "bd-remove"
};