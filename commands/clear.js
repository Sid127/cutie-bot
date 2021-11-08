exports.run = async(client, message, args) => {

    const amount = args.join(' '); // Amount of messages which should be deleted

    if (!amount) return message.reply({content:'you haven\'t given an amount of messages which should be deleted!'}); // Checks if the `amount` parameter is given
    if (isNaN(amount)) return message.reply({content:'the amount parameter isn`t a number!'}); // Checks if the `amount` parameter is a number. If not, the command throws an error

    if (amount > 100) return message.reply({content:'you can`t delete more than 100 messages at once!'}); // Checks if the `amount` integer is bigger than 100
    if (amount < 1) return message.reply({content:'you have to delete at least 1 message!'}); // Checks if the `amount` integer is smaller than 1

    await message.channel.messages.fetch({ limit: amount }).then(messages => { // Fetches the messages

        message.channel.bulkDelete(messages)
        message.channel.send({content:`Deleted ${amount} messages`})
            .then(msg => {
                msg.delete({ timeout: 5000 })
            })
            .catch(console.error); // Bulk deletes all messages that have been fetched and are not older than 14 days (due to the Discord API)
    });
}

exports.config = {
	guildOnly: true,
	aliases: ["purge"],
	permLevel: "modAssist",
	name: "clear",
	category: "Modmin",
	description: "Bulk delete messages",
	usage: ["[<number of messages to delete>]"]
};