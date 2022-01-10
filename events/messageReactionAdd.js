module.exports = {
  name: "messageReactionAdd",
  async execute(reaction, user, client) {
    const { Permissions, MessageEmbed } = require("discord.js");

    if(reaction.message.channel.type === 'DM') return;
    if(user.partial) await user.fetch();
    if(reaction.partial) await reaction.fetch();
    if(reaction.message.partial) await reaction.message.fetch();

    if(user.bot) return;
	let mmbr = await reaction.message.guild.members.cache.get(user.id)

	let reactionMenu = `${reaction.message.channel.id}/${reaction.message.id}`

	if(client.cache[reaction.message.guild.id].reactionRoles.includes(reactionMenu)){
		let reactions = await client.serverData.get(`${reaction.message.guild.id}.reactionRoles.${reactionMenu}`)
		if (Object.keys(reactions).includes(reaction.emoji.name)){
			if(await client.serverData.get(`${reaction.message.guild.id}.reactionRoles.${reactionMenu}.mode`) === "single"){
				for (key of Object.keys(reactions)){
					if(key !== reaction.emoji.name){
						if(!["header", "mode"].includes(key)){
							await reaction.message.reactions.cache.get(key).users.remove(mmbr).catch(console.error);
							role = reaction.message.guild.roles.cache.get(reactions[key])
							mmbr.roles.remove(role).catch(console.error);
						}
					}
				}
				role = reaction.message.guild.roles.cache.get(reactions[reaction.emoji.name])
				mmbr.roles.add(role).catch(console.error);
			} else {
				role = reaction.message.guild.roles.cache.get(reactions[reaction.emoji.name])
				mmbr.roles.add(role).catch(console.error);
			}
		}
	}

    let ticketid = await client.serverData.get(`${reaction.message.guild.id}.ticket`);

    if(!ticketid) {} else {
	  if(reaction.message.guild){
	    client.cache[reaction.message.guild.id].prefix === "" ? client.prefix = client.config.prefix : client.prefix = client.cache[reaction.message.guild.id].prefix
	  }

	  if(reaction.message.channel.id == ticketid && reaction.emoji.name == '🎫') {
	      reaction.users.remove(user);
	      reaction.message.guild.channels.create(`ticket-${user.username}`, {
	        parent: `${reaction.message.channel.parentId}`,
	        type: 'text'
	      }).then(channel => {
	          //update ticket channel permissions
	          channel.permissionOverwrites.set([{
	            id: mmbr.id,
	            allow: [Permissions.FLAGS.VIEW_CHANNEL, Permissions.FLAGS.SEND_MESSAGES]
	          }])
	          let embed= new MessageEmbed().setTitle("Welcome to your ticket!").setDescription(`Thanks for trying out our ticket support system. You've opened a ticket, which creates this channel that will last as long as you need it to. When your support conversation is done, please use the command \`${client.prefix} close\` to close the channel.`).setColor(0xffd1dc)
	          channel.send({embeds:[embed]})
			  channel.lockPermissions()
	      })
	  }
	}
  }
}
