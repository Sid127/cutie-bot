exports.run = async(client, message, args) => {
    if(args[0] === "disabled"){
        client.cache[message.guild.id].activityLeaderboard = args[0]//update our local cache
        await client.serverData.set(`${message.guild.id}.activityLeaderboard`, args[0])//update mongo
        message.channel.send("Activity based points system disabled")
    } else if (args[0] === "enabled"){
        client.cache[message.guild.id].activityLeaderboard = args[0]//update our local cache
        await client.serverData.set(`${message.guild.id}.activityLeaderboard`, args[0])//update mongo
        message.channel.send("Activity based points system enabled")
    } else if (args[0] === "channel") {
		if (!message.mentions.channels.first().id) return message.reply({content:"You silly goose that's not how you do it"});
		await client.serverData.set(`${message.guild.id}.lvlUpChnl`, message.mentions.channels.first().id)
		message.channel.send({content:"Okie, I'll send level up messages there from now"})
	}
}
