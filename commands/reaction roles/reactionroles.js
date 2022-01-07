exports.run = async(client, message, args) => {
	const { MessageEmbed } = require("discord.js")
    let [param, ...arguments] = args.split(" ")

	//code to delete a reaction role
	if (param === "delete") {
		await client.serverData.set(`${message.guild.id}.reactionRoles.${reactionMessage.id}`, mongoObj)
		client.cache[message.guild.id][reactionRoles].splice(indexOf(arguments[0]), 1)
	}

	// code to create a reactionrole
    if (param === "create") {
		// inital variables
        let [header, description] = arguments.join(" ").split("|")
        descriptors = description.split("\n")
		let limit = 0
		let mongoObj = {}
		let embed = new MessageEmbed()
	        .setColor('RANDOM')
			.setTitle(header)
		let embedDescription = ""

		// derived through arcane magic. Imperfect. DO NOT TOUCH
        const emojiRegex = /(<a?:.+:(\d+)>|[\p{Emoji}\u200d]+).*/gu

		//parse emoji and role data
        for (line of descriptors) {
            for (const match of line.matchAll(emojiRegex)) {
				limit ++
				if (limit > 20) return message.channel.send("I'm sorry friendo, only 20 reactions per message") // exit if user tries to assing more than 20 roles at once

				// add data to an object to be pushed to mongo
            	const emoji = match[1];
				if(line.includes(':')){
					roleStub = line.slice(line.indexOf(':'))
					role = roleStub.slice(roleStub.indexOf('&')+1, roleStub.indexOf('>'))
					mongoObj[emoji] = role
				}
            }
			// also parse stuff to be put into the embed
			line.includes(":") ? embedDescription = `${embedDescription} ${line.slice(0, line.indexOf(':'))}\n` : embedDescription = `${embedDescription} ${line}\n`
        }
		console.log(mongoObj)
		// put parsed text into embed
		embed.setDescription(embedDescription)
		let reactionMessage = await message.channel.send({embeds: [embed]})

		//attempt adding all reactions
		for (key of Object.keys(mongoObj)){
			try{
				await reactionMessage.react(key)
			} catch(err){
				message.channel.send(`I seem to be having trouble reacting with ${key}, could you try using a different emoji for that one?`)
				reactionMessage.reactions.removeAll()
				break;
			}
		}

		//finally, push to mongo and update local cache
		await client.serverData.set(`${message.guild.id}.reactionRoles.${reactionMessage.id}`, mongoObj)
		client.cache[message.guild.id]["reactionRoles"].push(reactionMessage.id)
    }
}

exports.config = {
	guildOnly: true,
	aliases: ["rr", "ras"],
	permLevel: "serverAdmin",
	name: "reactionroles",
	description: "Creat, Edit, and Delete reaction based role assigners.",
	usage: ["create (heading) | (emoji - role description : role) *one per line*", "delete"]
};
