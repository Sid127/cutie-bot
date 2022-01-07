module.exports = {
	name: "messageReactionRemove",
	async execute(reaction, user, client) {
		if(reaction.message.channel.type === 'DM') return;
		if(user.partial) await user.fetch();
		if(reaction.partial) await reaction.fetch();
		if(reaction.message.partial) await reaction.message.fetch();

		if(user.bot) return;
		let mmbr = await reaction.message.guild.members.cache.get(user.id)

		if(client.cache[reaction.message.guild.id].reactionRoles.includes(reaction.message.id)){
			let reactions = await client.serverData.get(`${reaction.message.guild.id}.reactionRoles.${reaction.message.id}`)
			if (Object.keys(reactions).includes(reaction.emoji.name)){
				role = reaction.message.guild.roles.cache.get(reactions[reaction.emoji.name])
				mmbr.roles.remove(role).catch(console.error);
			}
		}
	}
}
