exports.run = async (client, message, args) => {
	let [param, arg] = args.join(" ").split(" ")
	let loggerChnl = null
	//grab channel metadata
	if(message.mentions.channels.first()){
		let channel = message.mentions.channels.first();
		loggerChnl = channel.id;
	}
	if(param !== "off"){
		if(!loggerChnl) return message.channel.send("You silly goose that's not how you do it")
	}

	switch (param) {
		case 'ticket' : {
			//push data to mongo
			await client.serverData.set(`${message.guild.id}.ticLog`, loggerChnl);

			//confirm it to the user
			message.channel.send(`Ticket logs set to <#${loggerChnl}>.`)
		} break;
		case 'modlog' : {
			//push data to mongo
			await client.serverData.set(`${message.guild.id}.modLog`, loggerChnl);

			//confirm it to the user
			message.channel.send(`Moderation logs set to <#${loggerChnl}>.`)
		} break;
		case 'off' : {
			let logger = ''
			arg === 'ticket' ? logger = "ticLog" : (arg === 'modlog' ? logger = "modLog" : (!arg ? logger = 'logChnl' : logger = ''))
			if(!['ticLog', 'modLog', 'logChnl'].includes(logger)) return message.channel.send("What do I doooooooooooo?")
			await client.serverData.set(`${message.guild.id}.${logger}`, null);
			return message.channel.send({content:"Okie, log channel unset"})
		} break;
		default : {
			//push data to mongo
			await client.serverData.set(`${message.guild.id}.logChnl`, loggerChnl);

			//confirm it to the user
			message.channel.send(`Audit logs set to <#${loggerChnl}>`)
		}
	}
}
