exports.run = async(client, message, args) => {
	let feedID = args

	let feedInfo = await client.serverData.get(`feeds.${feedID}`)
	if (!feedInfo) return message.channel.send("I'm sorry, I don't think I have any information on that feed. Are you sure you pasted the ID right?")

	if(!Object.keys(feedInfo).includes(message.guild.id)) return message.channel.send("That feed is already disabled here")
	else{
		await client.serverData.delete(`feeds.${feedID}.${message.guild.id}`)
		message.channel.send("Feed deleted")
	}

	if(JSON.stringify(Object.keys(await client.serverData.get(`feeds.${feedID}`).sort())) === JSON.stringify(["latest", "niceName", "type"])) {
		await client.serverData.delete(`feeds.${feedID}`)
	}
}

exports.config = {
	guildOnly: true,
	aliases: ["stopfeed"],
	permLevel: "modAssist",
	name: "killfeed",
	description: "Stop posting an RSS feed",
	usage: []
};