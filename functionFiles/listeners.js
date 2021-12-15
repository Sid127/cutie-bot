const moment = require("moment-timezone")

//our very own BGS tick listener
tickListener = async (client) => {
    const { asyncEBGS } = require("./APICalls.js");

    //create an empty tick table
    await client.serverData.ensure(`tick`, {
        id: null,
        time: "1970-01-01T00:00:00.000Z",
        updatedAt: null,
        v: null
    });

    //get tick data from EBGS
    var tempData = await asyncEBGS("/ticks")
    var tickData = tempData.data

    //check to see if tick id changed, and if it has, push new data to mongo and send an update message
    let oldID = client.cache.tick.id
    if(oldID !== tickData[0]._id){
        //update out local cache
        client.cache.tick.id = tickData[0]._id
        client.cache.tick.time = tickData[0].time
        client.cache.tick.updatedAt = tickData[0].updated_at
        client.cache.tick.v = tickData[0].__v

        //update mongo while we're at it too
        await client.serverData.set(`tick.id`, tickData[0]._id)
        await client.serverData.set(`tick.time`, tickData[0].time)
        await client.serverData.set(`tick.updatedAt`, tickData[0].updated_at)
        await client.serverData.set(`tick.v`, tickData[0].__v)

        let ticktime = moment.utc(tickData[0].time).format('MMMM Do YYYY, h:mm a')

        //create the embed beforehand
        const embed = {
            "title": "BGS Tick Detected",
            "color": 4751592,
            "fields": [{
                    "name": "Latest Tick Was At:",
                    "value": `${ticktime} UTC`
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
    //grab all data into a map
    let db = await client.peopleData.filter(p => p.date)
    for (ident of db) {
        // these two variables are used in both cases
        const sendGuild = ident[1]['guild'];
        const birthdayRole = await client.serverData.get(`${sendGuild}.birthdayRole`);

        //don't run this block if we're not in that guild
        if (!client.guilds.cache.get(sendGuild)) continue;

        // user data we're targeting now
        const birthdayFolk = client.guilds.cache.get(sendGuild).members.cache.get(ident[1]['user']);

        if(!birthdayFolk) {} else{
            // if statement for setting the role
            if (moment().tz(ident[1]['timezone']).format('MM-DD') === ident[1]['date']) {
                // set role and send message
                if (!birthdayFolk.roles.cache.get(birthdayRole)) {
                    birthdayFolk.roles.add(birthdayRole);

                    // get the channel where to send a message
                    const msgChannel = await client.serverData.get(`${sendGuild}.birthdayChnl`);
                    client.channels.cache.get(msgChannel).send(`Happy Birthday, <@${ident[1]['user']}>`)
                }
            } else { // else remove the role
                if (birthdayFolk.roles.cache.get(birthdayRole)) {
                    birthdayFolk.roles.remove(birthdayRole);
                }
            }
        }
    }
}

//listeners that operate on a 15 minute timer
module.exports.chck15 = async (client) => {
    setInterval(async() => {
        bdayChck(client)
    }, 10000)
}

//listeners that operate on a 10 minute timer
module.exports.chck10 = async (client) => {
    setInterval(async() => {
        tickListener(client)
    }, 600000)
}
