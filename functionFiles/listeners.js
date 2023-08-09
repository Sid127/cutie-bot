const moment = require("moment-timezone")

//our very own BGS tick listener
tickListener = async (client) => {
	const { AxiosEBGS } = require("./APICalls.js");

    //create an empty tick table
    await client.serverData.ensure(`tick`, {
        time: "1970-01-01T00:00:00.000Z",
    });

    //get tick data from EBGS
    let tickData = await AxiosEBGS("/ticks");

    //check to see if tick id changed, and if it has, push new data to mongo and send an update message
    let oldID = client.cache.tick.time

    if(oldID !== tickData[0].time){
        //update our local cache
        client.cache.tick.time = tickData[0].time

        //update mongo while we're at it too
        await client.serverData.set(`tick.time`, tickData[0].time)

		let year = parseInt(moment.utc(tickData[0].time).format(`YYYY`))+1286
        let ticktime = moment.utc(tickData[0].time).format(`MMMM Do ${year}, h:mm a`)

        //create the embed beforehand
        const embed = {
            "title": "BGS Tick Detected",
            "color": 4751592,
            "fields": [{
                    "name": "Latest Tick Was At:",
                    "value": `${ticktime} GMT`
                }
            ]
        };
        //grab all the guilds we're in
        let guilds = await client.serverData.keys
        for (g of guilds) {
            //don't run this block if we're not in that guild
            if (!client.guilds.cache.get(g)) {}
            //don't run if the bgs listener isn't set up
            else if (await client.serverData.get(`${g}.bgsChnl`) === null) {}
            //grab the channel and send the message
            else {
                let bgsChnl = await client.serverData.get(`${g}.bgsChnl`)
                client.channels.cache.get(bgsChnl).send({embeds: [embed]})
            }
        }
    }
}

//a function that checks if there's a birthday right now
bdayChck = async (client) => {
    //grab all the people data which have a date
    let db = await client.peopleData.filter(p => p && p.date)
    for (ident of db) {
        for (userObjectKey of Object.keys(ident[1])) {
			// check if date or timezone keys, skip those
            if(userObjectKey === "date" || userObjectKey === "timezone"){
				continue;
			}
            if(ident[1][userObjectKey]["bdayEnabled"] === true){
                let sendGuild = userObjectKey
                //run a few sanity checks
                if (!client.guilds.cache.get(sendGuild)) continue;

                let server = client.guilds.cache.get(sendGuild)

                // user data we're targeting now
                const birthdayFolk = server.members.cache.get(ident[0]);

                if(!birthdayFolk) {} else {
                    // a few more sanity checks
                    const birthdayRole = await client.serverData.get(`${sendGuild}.birthdayRole`);
                    const msgChannel = await client.serverData.get(`${sendGuild}.birthdayChnl`);
                    if (!birthdayRole || !msgChannel) {
                        console.log(`Birthday check, something went wrong... Guild ID: ${sendGuild}`);
                        continue;
                    }

                    // if statement for setting the role
                    if (moment().tz(ident[1]['timezone']).format('MM-DD') === ident[1]['date'] || moment().tz(ident[1]['timezone']).format('MM-D') === ident[1]['date']) {
                        // set role and send message
                        if (!birthdayFolk.roles.cache.get(birthdayRole)) {
                            if(server.roles.cache.get(birthdayRole).position > server.me.roles.highest.position) continue;
                            birthdayFolk.roles.add(birthdayRole);
                            try{
                                await client.channels.cache.get(msgChannel).send(`Happy Birthday, <@${ident[0]}>`)
                            } catch (e) {
                                throw new Error(`Either I couldn't add a role, or couldn't send the message. Guild ID: ${sendGuild}. Member ID: ${ident[0]}`)
                            }
                        }
                    } else { // else remove the role
                        if (birthdayFolk.roles.cache.get(birthdayRole)) {
                            birthdayFolk.roles.remove(birthdayRole);
                        }
                    }
                }
            }
        }
    }
}

// a function that posts the latest item in an RSS feed
rssListener = async (client) => {
    const feedType = {
        "steam": "https://store.steampowered.com/feeds/news/app/",
        "yt": "https://www.youtube.com/feeds/videos.xml?channel_id=",
        "twitch": "https://twitchrss.appspot.com/vod/",
        "other": ""
    }
    
    let Parser = require('rss-parser');
    let parser = new Parser();
    
    let db = await client.serverData.get(`feeds`)
    for(rssKey of Object.keys(db)){
        rssURL = `${feedType[db[rssKey].type]}${rssKey}`
        if (db[rssKey].type === "other") { rssURL = db[rssKey].url }
        let feed = await parser.parseURL(rssURL);
        firstItem = feed.items.shift();

        if (firstItem.title === db[rssKey].latest) continue;
    
        let sendGuilds = Object.keys(db[rssKey])
    
        await client.serverData.set(`feeds.${rssKey}.latest`, firstItem.title)

        for(g of sendGuilds){
            if(["latest", "type"].includes(g)) continue;
    
            //run a few sanity checks
            if (!client.guilds.cache.get(g)) continue;
    
            let msgChannel = db[rssKey][g]
    
            if(!client.channels.cache.get(msgChannel)) continue;

            await client.channels.cache.get(msgChannel).send(`New post from ${db[rssKey].niceName}\n**${firstItem.title}**\n${firstItem.link}`)
        }
    }
}

monitorPush = async (client) => {
    const { exec } = require("child_process");
    exec(`wget --quiet -O /dev/null ${client.hardcoded.monitor}`)
}

module.exports.listeners = async (client) => {
    const cron = require('node-cron');

    cron.schedule('*/30 * * * *', () => {
        bdayChck(client)
        rssListener(client)
        tickListener(client)
    });

    cron.schedule('*/15 * * * *', () => {
        monitorPush(client)
    });
}
