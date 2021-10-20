exports.run = async(client, message, args) => {
    
    //initialize required settings and variables
    await client.settings.ensure(`${message.guild.id}`, {
        hiddenRoles: null,
        blacklistPfx: null
    })

    //parse args
    let [action, param, ...details] = args.split(" ")
    
    //display blacklist if no args passed
    if(!args){
        prefixes = await client.settings.push(`${message.guild.id}.blacklistPfx`).join(", ")
        roles = await client.settings.push(`${message.guild.id}.hiddenRoles`)

        for(r of roles){
            roles = client.guild.roles.cache.filter(r => r.name).join(", ")
        }
        message.channel.send(`Blacklist:\n\nPrefixes: \`${prefixes}\`\n\nRoles: ${roles}`)
    }
    //code to add blacklists to mongo
    else if (action === add) {
        if (param === "prefix" || param === "pfx"){
            let pfx = details
            await client.settings.push(`${message.guild.id}.blacklistPfx`, pfx)
            message.channel.send(`Role prefix${message.mentions.roles.length === 1 ? "" : "es"} blacklisted`)
        } else if (param === "roles") {
            let roles = message.mentions.roles.map(role => role.id)
            await client.settings.push(`${message.guild.id}.hiddenRoles`, roles)
            message.channel.send(`Role${message.mentions.roles.length === 1 ? "" : "s"} blacklisted`)
        } else message.channel.send("I'm not genie, tell me what you wanna add :/")
    //code to remove all blacklists of a type
    } else if (action === "clear"){
        if (param === "prefix" || param === "pfx"){
            await client.settings.push(`${message.guild.id}.blacklistPfx`, null)
            message.channel.send("Role prefix blacklist cleared")
        } else if (param === "roles") {
            await client.settings.push(`${message.guild.id}.hiddenRoles`, blacklist)
            message.channel.send("Role blacklist cleared")
        } else message.channel.send("I'm not a genie, tell me what you wanna remove :/")
    } else {
        message.channel.send("No no no no no no no no no. NO. **NO.**\nI dunno what you want from me")
    }
}

exports.conf = {
	enabled: true,
	guildOnly: true,
	aliases: [],
	permLevel: "serverAdmin"
};

exports.help = {
	name: "blacklist",
	category: "Modmin",
	description: "Hide a role from the bot frontend",
	usage: "blacklist add roles <@roles>\nblacklist add pfx <roleprefixes>\nblacklist clear pfx <role prefixes>\nblacklist"
};