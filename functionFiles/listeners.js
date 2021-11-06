const moment = require("moment-timezone")

//a function that checks if there's a birthday right now
bdayChck = async (client) => {
    //grab all data into a map
    let db = await client.peopleData.filter(p => p.timezone)
    for (ident of db) {
        // these two variables are used in both cases
        const sendGuild = ident[1]['guild'];
        const birthdayRole = await client.serverData.get(`${sendGuild}.birthdayRole`);

        //don't run this block if we're not in that guild
        if (!client.guilds.cache.get(sendGuild)) return;

        // user data we're targeting now
        const birthdayFolk = client.guilds.cache.get(sendGuild).members.cache.get(ident[1]['username']);

        // if statement for setting the role
        if (moment().tz(ident[1]['timezone']).format('DD-MMM') === ident[1]['date']) {
            // set role and send message
            if (!birthdayFolk.roles.cache.get(birthdayRole)) {
                birthdayFolk.roles.add(birthdayRole);

                // get the channel where to send a message
                const msgChannel = await client.serverData.get(`${sendGuild}.birthdayChnl`);
                client.channels.cache.get(msgChannel).send(`Happy Birthday, <@${ident[1]['username']}>`)
            }
        } else { // else remove the role
            if (birthdayFolk.roles.cache.get(birthdayRole)) {
                birthdayFolk.roles.remove(birthdayRole);
            }
        }
    }
}

//listeners that operate on a 15 minute timer
module.exports.chck15 = async (client) => {
    setInterval(async() => {
        bdayChck(client)
    }, 900000)
}
