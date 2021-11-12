exports.run = async(client, message, args) => {
    
    //initialize required settings and variables
    await client.serverData.ensure(`${message.guild.id}`, {
        hiddenRoles: null,
        blacklistPfx: null
    })
    const { mongoGet } = require("../../functionFiles/helperFunctions.js")

    //parse args
    let [action, param, ...details] = args.split(" ")
    
    //display blacklist if no args passed
    if(!args){
        blacklistMap = await mongoGet(client, message.guild.id, ["blacklistPfx", "hiddenRoles"])
        roles = blacklistMap.get('hiddenRoles')
        if (!roles && !blacklistMap.get('blacklistPfx')) return message.channel.send("Blacklist isn't set, are you toying with me?")
        sendroles = []

        for(r of roles){
            sendroles.push(message.guild.roles.cache.find(role => role.id === r))
        }

        message.channel.send(`Blacklist\n\nPrefixes: ${blacklistMap.get(`blacklistPfx`).join(" ") || "No prefixes set"} \nRoles: ${sendroles.join(" ") || "No roles set"}`)
    }
    //code to add blacklists to mongo
    else if (action === "add") {
        if (param === "prefix" || param === "pfx"){
            let pfx = details
            await client.serverData.set(`${message.guild.id}.blacklistPfx`, pfx)
            message.channel.send(`Role prefix${message.mentions.roles.length === 1 ? "" : "es"} blacklisted`)
        } else if (param === "roles") {
            let roles = message.mentions.roles.map(role => role.id)
            await client.serverData.set(`${message.guild.id}.hiddenRoles`, roles)
            message.channel.send(`Role${message.mentions.roles.length === 1 ? "" : "s"} blacklisted`)
        } else message.channel.send("I'm not genie, tell me what you wanna add :/")
    //code to remove all blacklists of a type
    } else if (action === "clear"){
        if (param === "prefix" || param === "pfx"){
            await client.serverData.set(`${message.guild.id}.blacklistPfx`, [])
            message.channel.send("Role prefix blacklist cleared")
        } else if (param === "roles") {
            await client.serverData.set(`${message.guild.id}.hiddenRoles`, [])
            message.channel.send("Role blacklist cleared")
        } else message.channel.send("I'm not a genie, tell me what you wanna remove :/")
    } else {
        message.channel.send("No no no no no no no no no. NO. **NO.**\nI dunno what you want from me")
    }
}

exports.config = {
	guildOnly: true,
	aliases: [],
	permLevel: "serverAdmin",
	name: "blacklist",
	description: "Hide a role from the bot frontend",
	usage: ["[add || clear] roles <@roles>", "[add || clear pfx <role prefixes>"]
};