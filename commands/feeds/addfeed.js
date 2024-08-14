// Require call for getting details of feeds
const { AxiosWebPage } = require("../../functionFiles/APICalls.js");

exports.run = async(client, message, args) => {
	//initialize the rss parser to test if it is a valid feed
    let Parser = require('rss-parser');
    let parser = new Parser();

    let [param, chnl, link] = args.split(" ")
    if (!message.mentions.channels.first()) return message.channel.send("Okay, but what channel do you want me to post to?")
    link = link.replace(/\/$/, "") //remove trailing slash
    param = param.toLowerCase().trim()

    //parse the command and construct various metadata
    switch (param){
        case "steam": {
            if (!link.includes("store.steampowered.com")) return message.reply("Please give me a steam store page link :(")
            
            let appID = link.match(/\d+/)
            niceName = link.match(/[^\/]+$/).shift().replaceAll("_", " ")
            appID = parseInt(appID.shift())
            
            rssURL = `https://store.steampowered.com/feeds/news/app/${appID}/`
            mongoKey = appID
            break;
        }
        case "yt":
        case "youtube": {
            param = "yt"
            rssURL = "https://www.youtube.com/feeds/videos.xml?channel_id="
            
            if (link.includes("youtu")){
                if (link.includes("/c/")){
                    let dataStream = await AxiosWebPage(link, "")
                    channelURL = dataStream.match(/(?<=og:url" content=").*?(?=\">)/gi).shift()
                    niceName = dataStream.match(/(?=itemprop="name" content=").*?(?=\">)/gi).shift().match(/[^\"]+$/).shift()
                }
            } else return message.reply("Please give me a youtube channel's home page link :(")
            
            mongoKey = channelURL.match(/[^\/]+$/)
            rssURL = rssURL + mongoKey
            break;
        }
        case "twitch": {
            if(!link.includes("twitch.tv")) return message.reply("Please give me a twitch channel link :(")
            mongoKey = link.match(/[^\/]+$/)
            niceName = mongoKey
            rssURL = `https://twitchrss.appspot.com/vod/${mongoKey}`
            break;
        }
        case "other": {
            rssURL = link
            const { hostname } = new URL(rssURL);
            mongoKey = hostname.match(/(?<=\.).+?(?=\.)|.+?(?=\.)/g).shift()
            mongoKey === "itssimple" ? mongoKey = "galnet" : {}
            mongoKey === "indiegamebundles" ? mongoKey = "freegames" : {}
            break;
        }
        default: return message.reply("That's not a valid feed type, my friend")
    }

    let feed = await parser.parseURL(rssURL).catch(error => {
        return message.channel.send("There was an error parsing the RSS feed");
    })
    
    if (param === "other") niceName = feed.title;

    if(await client.serverData.has(`feeds.${mongoKey}`)) {
        await client.serverData.set(`feeds.${mongoKey}.${message.guild.id}`, message.mentions.channels.first().id)
        return message.channel.send(`Okay! Reading feed ${niceName}, and I'll post updates in ${message.mentions.channels.first()}`);
    }

    let firstItem = feed.items ? feed.items.shift() : message.channel.send("I'll read the feed, yes, but right now it appears empty to me :|\nPlease re-check it once? Your link could also be wrong")

    let mongoObject = {
        "type": param,
        "niceName": niceName,
        "latest": firstItem.title
    }
    if (param === "other") { mongoObject["url"] === rssURL }
    mongoObject[message.guild.id] = message.mentions.channels.first().id
    
    //set the settings for the feed
    await client.serverData.set(`feeds.${mongoKey}`, mongoObject)

    //wrap up and confirm to the user
    message.channel.send(`Okay! Reading feed ${niceName}, and I'll post updates in ${message.mentions.channels.first()}`);
}

exports.config = {
	guildOnly: true,
	aliases: ["newfeed"],
	permLevel: "modAssist",
	name: "addfeed",
	description: "Create a new RSS feed\nSome useful \"other\" feeds:\nGalNet :: https://itssimple.se/edgalnet/rss.php\nFree Games :: https://www.indiegamebundles.com/category/free/feed",
	usage: ["[steam|yt|twitch|other] [#channel] [<url>]"]
};
