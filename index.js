const {Client, Intents} = require("discord.js");
const Josh = require("@joshdb/core");
const provider = require("@joshdb/mongo");
const fs = require("fs");

const myIntents = new Intents();
myIntents.add(Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_BANS, Intents.FLAGS.GUILD_MESSAGE_REACTIONS, Intents.FLAGS.GUILD_PRESENCES, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.DIRECT_MESSAGES);
const client = new Client({ partials: ["MESSAGE", "USER", "REACTION", "CHANNEL"], intents: myIntents});
const config = require("./config.json");

// note: some hardcoded stuff remains in places where mongo ensures are performed
client.hardcoded = require("./functionFiles/hardcoded.json")

// We also need to make sure we're attaching the config to the CLIENT so it's accessible everywhere!
client.config = {prefix: config.prefix};

//initialize mongo connections
client.serverData = new Josh({
    name: 'Cutie',
    provider,
    providerOptions: {
        collection: "serverdata",
        dbName: "Cutie",
        url: config.mongoURL
    }
});
client.peopleData = new Josh({
    name: 'Cutie',
    provider,
    providerOptions: {
        collection: "peopledata2",
        dbName: "Cutie",
        url: config.mongoURL
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
        //console.log(`Loading Command: ${props.config.name}`);
        if (props.init) {
            props.init(client);
        }
        props.config.category = categoryName;
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
	// variables for holding number of commands found/loaded
	let numFound = 0;
	let numLoaded = 0;

	// read the commands folder and loop through all modules found
    const moduleFolders = await readdir(`./commands/`);
    moduleFolders.forEach(async (d, index) => {
		// read the module folder, and loop through all commands in there
        const cmdFiles = await readdir(`./commands/${d}/`);
        cmdFiles.forEach(f => {
			// check if file doesn't end with .js, not a command so return
            if (!f.endsWith(".js")) return;

			// add a number to the commands found
			numFound++;

			// try loading the command
            const response = loadCommand(d, f);

			// if there's a response, loading failed, log that, if no response, everything fine and increment number of loaded commands
            response ? console.log(`${response}\n`) : numLoaded++
        });

		// on last iteration of the forEach
		if (index === moduleFolders.length - 1) {
			// at the end log out a message of how many found, and how many loaded
			console.log(`Found "${numFound}" commands, in "${moduleFolders.length}" modules.\n` +
			`Loaded "${numLoaded}" commands successfully.\n`);
		}
    });



    client.cache = new Object();
    let tempCache = await client.serverData.getMany(await client.serverData.keys)
    for (key of Object.keys(tempCache)) {
        if(!client.hardcoded.badServerDataKeys.includes(key)){
            client.cache[key] = {}
            client.cache[key]["enabledModules"] = tempCache[key].enabledModules
            client.cache[key]["prefix"] = tempCache[key].prefix
            client.cache[key]["activityLeaderboard"] = tempCache[key].activityLeaderboard
            client.cache[key]["cc"] = Object.keys(tempCache[key].customCommands)
			client.cache[key]["reactionRoles"] = Object.keys(tempCache[key].reactionRoles)
        }
    }
    client.cache.tick = tempCache.tick
    console.log("Local cache created")
}

init();

const { listeners } = require("./functionFiles/listeners.js");
listeners(client);

client.login(config.token);
