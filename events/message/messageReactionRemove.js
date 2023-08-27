module.exports = {
	name: "messageReactionRemove",
	async execute(reaction, user, client) {
		if(reaction.message.channel.type === 'DM') return;
		if(user.partial) await user.fetch();
		if(reaction.partial) await reaction.fetch();
		if(reaction.message.partial) await reaction.message.fetch();

		if(user.bot) return;
		let mmbr = await reaction.message.guild.members.cache.get(user.id)

		let reactionMenu = `${reaction.message.channel.id}/${reaction.message.id}`

		if(client.cache[reaction.message.guild.id].reactionRoles.includes(reactionMenu)){
			let reactions = await client.serverData.get(`${reaction.message.guild.id}.reactionRoles.${reactionMenu}`)
			for (key of Object.keys(reactions)){
				if(key.match(reaction.emoji.name)){
					role = reaction.message.guild.roles.cache.get(reactions[key.match(reaction.emoji.name).input])
					mmbr.roles.remove(role).catch(console.error);
				}
			}
		}
	}
}
