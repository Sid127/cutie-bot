const {Client, Intents} = require("discord.js");
const Josh = require("@joshdb/core");
const provider = require("@joshdb/mongo");
const fs = require("fs");

const myIntents = new Intents();
myIntents.add(Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_BANS, Intents.FLAGS.GUILD_MESSAGE_REACTIONS, Intents.FLAGS.GUILD_PRESENCES, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.DIRECT_MESSAGES);
const client = new Client({ partials: ["MESSAGE", "USER", "REACTION", "CHANNEL"], intents: myIntents});
const config = require("./config.json");

client.mongoUrl = config.mongoURL
client.botadmin = new Map()

// We also need to make sure we're attaching the config to the CLIENT so it's accessible everywhere!
client.config = config;
client.points = new Josh({
    name: 'Cutie',
    provider,
    providerOptions: {
        collection: "points",
        dbName: "Cutie",
        url: client.mongoUrl
    }
});
client.settings = new Josh({
    name: 'Cutie',
    provider,
    providerOptions: {
        collection: "settings",
        dbName: "Cutie",
        url: client.mongoUrl
    }
});

client.birthdays = new Josh({
    name: 'Cutie',
    provider,
    providerOptions: {
        collection: "birthdays",
        dbName: "Cutie",
        url: client.mongoUrl
    }
});

const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const event = require(`./events/${file}`);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args, client));
	} else {
		client.on(event.name, (...args) => event.execute(...args, client));
	}
}

client.commands = new Map();
client.aliases = new Map();

loadCommand = (commandName) => {
    try {
        const props = require(`./commands/${commandName}`);
        console.log(`Loading Command: ${props.help.name}`);
        if (props.init) {
            props.init(client);
        }
        client.commands.set(props.help.name, props);
        props.conf.aliases.forEach(alias => {
            client.aliases.set(alias, props.help.name);
        });
        return false;
    } catch (e) {
        return `Unable to load command ${commandName}: ${e}`;
    }
};

// Here we load **commands** into memory, as a collection, so they're accessible
// here and everywhere else.
const {
	promisify
} = require("util");
const readdir = promisify(require("fs").readdir);

const init = async() => {
    const cmdFiles = await readdir("./commands/");
    cmdFiles.forEach(f => {
        if (!f.endsWith(".js"))
            return;
        const response = loadCommand(f);
        if (response)
            console.log(response);
    });

    let ids = await client.settings.keys
    for(i of ids) {
        client.botadmin.set(i, await client.settings.get(`${i}.botadmin`))
    }
} 

init();

setInterval(async() => {
    const moment = require("moment-timezone")
    let db = await client.birthdays.filter(p => p.timezone)
    for (ident of db) {

        // these two variables are used in both cases
        const sendGuild = ident[1]['guild'];
        const birthdayRole = await client.settings.get(`${sendGuild}.birthdayRole`);

        // user data we're targeting now
        const birthdayFolk = client.guilds.cache.get(sendGuild).members.cache.get(ident[1]['username']);

        // if statement for setting the role
        if (moment().tz(ident[1]['timezone']).format('DD-MMM') === ident[1]['date']) {
            // set role and send message
            if (!birthdayFolk.roles.cache.get(birthdayRole)) {
                birthdayFolk.roles.add(birthdayRole);

                // get the channel where to send a message
                const msgChannel = await client.settings.get(`${sendGuild}.birthdayChnl`);
                client.channels.cache.get(msgChannel).send(`Happy Birthday, <@${ident[1]['username']}>`)
            }
        } else { // else remove the role
            if (birthdayFolk.roles.cache.get(birthdayRole)) {
                birthdayFolk.roles.remove(birthdayRole);
            }
        }
    }

    let ids = await client.settings.keys
    for(i of ids) {
        client.botadmin.set(i, await client.settings.get(`${i}.botadmin`))
    }
}, 900000);

client.login(config.token);
