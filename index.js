const {Client, Intents} = require("discord.js");
const Josh = require("@joshdb/core");
const provider = require("@joshdb/mongo");
const fs = require("fs");

const myIntents = new Intents();
myIntents.add(Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_BANS, Intents.FLAGS.GUILD_MESSAGE_REACTIONS, Intents.FLAGS.GUILD_PRESENCES, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.DIRECT_MESSAGES);
const client = new Client({ partials: ["MESSAGE", "USER", "REACTION", "CHANNEL"], intents: myIntents});
const config = require("./config.json");

client.mongoUrl = config.mongoURL

// We also need to make sure we're attaching the config to the CLIENT so it's accessible everywhere!
client.config = config;
client.serverData = new Josh({
    name: 'Cutie',
    provider,
    providerOptions: {
        collection: "serverdata",
        dbName: "Cutie",
        url: client.mongoUrl
    }
});
client.peopleData = new Josh({
    name: 'Cutie',
    provider,
    providerOptions: {
        collection: "peopledata",
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

loadCommand = (categoryName, commandName) => {
    try {
        const props = require(`./commands/${categoryName}/${commandName}`);
        console.log(`Loading Command: ${props.config.name}`);
        if (props.init) {
            props.init(client);
        }
        props.config.category = categoryName.replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase());
        client.commands.set(props.config.name, props);
        props.config.aliases.forEach(alias => {
            client.aliases.set(alias, props.config.name);
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
    const moduleFolders = await readdir(`./commands/`);
    moduleFolders.forEach(async (d) => {
        const cmdFiles = await readdir(`./commands/${d}/`);
        cmdFiles.forEach(f => {
            if (!f.endsWith(".js"))
                return;
            const response = loadCommand(d, f);
            if (response)
                console.log(response);
        });
    })


    client.cache = new Object();
    let tempCache = await client.serverData.getMany(await client.serverData.keys)
    for (key of Object.keys(tempCache)) {
        if(!["botSettings", "tick"].includes(key)){
            client.cache[key] = {}
            client.cache[key]["enabledModules"] = tempCache[key].enabledModules
            client.cache[key]["prefix"] = tempCache[key].prefix
            client.cache[key]["activityLeaderboard"] = tempCache[key].activityLeaderboard
            client.cache[key]["homeSys"] = tempCache[key].home.homeSys
            client.cache[key]["cc"] = Object.keys(tempCache[key].customCommands)
			client.cache[key]["reactionRoles"] = Object.keys(tempCache[key].reactionRoles)

        }
        client.cache.botSettings = tempCache.botSettings
        client.cache.tick = tempCache.tick
    }
    console.log("Local cache created")
}

init();

const { chck15, chck10 } = require("./functionFiles/listeners.js");
chck15(client)
chck10(client)

client.login(config.token);
