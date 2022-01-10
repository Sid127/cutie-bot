exports.run = async(client, message, args) => {
	const { MessageEmbed } = require("discord.js")
    let [param, ...arguments] = args.split(" ")

	//code to delete a reaction role
	if (param === "delete") {
		let reactionMenu = arguments[0]
		if(!reactionMenu.includes("/")) return message.channel.send("I'll need you to paste the identifier for the menu given to you by the list :P")
		let [chnl, msg] = reactionMenu.split("/")
		try{
			await message.guild.channels.cache.get(chnl).messages.fetch(msg).then(msg => {msg.delete()}) //fetch and delete the reaction menu
		} catch {
			return message.channel.send("I'm not sure you pasted the identifier correctly, mind re-checking that?")
		}
		await client.serverData.delete(`${message.guild.id}.reactionRoles.${reactionMenu}`)//remove it from mongo
		client.cache[message.guild.id]["reactionRoles"].splice(client.cache[message.guild.id]["reactionRoles"].indexOf(reactionMenu), 1)//remove it from local cache
		message.react('☑️')
	}

	if (param === "list") {
		let embed = new MessageEmbed()
			.setColor('RANDOM')
			.setTitle("List of active reaction role menus")
		for (menu of client.cache[message.guild.id]["reactionRoles"]){
			header = await client.serverData.get(`${message.guild.id}.reactionRoles.${menu}.header`)
			embed.addField(header, menu)
		}
		message.channel.send({embeds: [embed]})
	}

	// code to create a reactionrole
    if (param === "create") {
		// inital variables
        let [header, description] = arguments.join(" ").split("|")
        descriptors = description.split("\n")
		let limit = 0
		let mongoObj = {
			"header": header,
			"mode": "multi"
			}
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
		// put parsed text into embed
		embed.setDescription(embedDescription)
		let reactionMessage = await message.channel.send({embeds: [embed]})

		//attempt adding all reactions
		for (key of Object.keys(mongoObj)){
			if(!["header", "mode"].includes(key)){
				try{
					await reactionMessage.react(key)
				} catch(err){
					message.channel.send(`I seem to be having trouble reacting with ${key}, could you try using a different emoji for that one?`)
					reactionMessage.reactions.removeAll()
					break;
				}
			}
		}

		//finally, push to mongo and update local cache
		await client.serverData.set(`${message.guild.id}.reactionRoles.${message.channel.id}/${reactionMessage.id}`, mongoObj)
		client.cache[message.guild.id]["reactionRoles"].push(`${message.channel.id}/${reactionMessage.id}`)
    }

	if (param === "setmode") {
		let [id, mode] = arguments.join(" ").split(" ")
		if (mode === "multi") {
			await client.serverData.set(`${message.guild.id}.reactionRoles.${id}.mode`, "multi")
			return message.react('☑️')
		}
		if (mode === "single") {
			await client.serverData.set(`${message.guild.id}.reactionRoles.${id}.mode`, "single")
			return message.react('☑️')
		}
		return message.channel.send(`Either "single" or "multi," nothing else"`)
	}
}

exports.config = {
	guildOnly: true,
	aliases: ["rr", "ras"],
	permLevel: "serverAdmin",
	name: "reactionroles",
	description: "Creat, Edit, and Delete reaction based role assigners.",
	usage: ["create (heading) | (emoji - role description : role) *one per line*", "delete (identifier)", "list", "setmode (identifier) (multi | single)"]
};
