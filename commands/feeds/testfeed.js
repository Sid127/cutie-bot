exports.run = async(client, message, args) => {

	let feedID = args.trim()

    const feedType = {
        "steam": "https://store.steampowered.com/feeds/news/app/",
        "yt": "https://www.youtube.com/feeds/videos.xml?channel_id=",
        "twitch": "https://twitchrss.appspot.com/vod/",
        "other": ""
    }

    let Parser = require('rss-parser');
    let parser = new Parser();

	let feedInfo = await client.serverData.get(`feeds.${feedID}`)
		
	if (!feedInfo) return message.channel.send("I'm sorry, I don't think I have any information on that feed")

	if(!Object.keys(feedInfo).includes(message.guild.id)) return message.channel.send("I do have information on that feed, but it isn't enabled here")

	rssURL = `${feedType[feedInfo.type]}${feedID}`
	let feed = await parser.parseURL(rssURL);
	firstItem = feed.items.shift();

	message.channel.send(`Okay, here's the latest post from that feed:\n\n:newspaper: | **${firstItem.title}**\n\n${firstItem.link}`)
}

exports.config = {
	guildOnly: true,
	aliases: [],
	permLevel: "modAssist",
	name: "testfeed",
	description: "Test an existing RSS feed",
	usage: []
};