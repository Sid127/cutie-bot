exports.run = async(client, message, args) => {
    //create the variables we'll use
    let [param, module] = args.split(" ")

    if(!args) return message.channel.send("Sometimes I wonder if you know what you're doing")
    //display a list of all available modules
    if (param === "list"){
        if(!module){
            let modules = []
            //grab all category names
            client.commands.forEach(command => {
                if (!modules.includes(command.config.category)){
                    modules.push(command.config.category) 
                }
            });
            message.channel.send(`I have quite a few modules, here's a list of them all:\n\n${modules.sort().join(`\n`)}`)
        }
        if(module){ // if a module is specified, display a list of commands in the module
            let commands = []
            //grab all commands in the given category
            client.commands.forEach(command => {
                if (module.toLowerCase() === command.config.category.toLowerCase()){
                    commands.push(command.config.name) 
                }
            });
            if (commands.length === 0) return message.channel.send("What. the. hell. do you want from me ;-;")
            message.channel.send(`Here's all the commands in the ${module} module:\n\n${commands.sort().join(`\n`)}`)
        }
    //code to disable modules
    } else if (param === "disable"){
        if(!module) return message.channel.send("What in tarnation...")
        if(["metadata", "management", "moderation"].includes(module.toLowerCase())) return message.channel.send("You monster... :(")
        //grab our cache in a variable
        let disabledModules = client.cache[message.guild.id].disabledModules
        //push disabled module to mongo
        if(!disabledModules.includes(module.toLowerCase())){
            disabledModules.push(module.toLowerCase())//push the newly disabled module into the variable
            client.cache[message.guild.id].disabledModules = disabledModules
            client.serverData.set(`${message.guild.id}.disabledModules`, disabledModules) //update mongo
            message.channel.send(`${module} module disabled`) //confirmation
        } else {message.channel.send("Yeah that one's already disabled")}
    //code to enable modules
    } else if (param === "enable"){
        if(!module) return message.channel.send("What in tarnation...")
        //grab our cache in a variable
        let disabledModules = client.disabledModules.get(`${message.guild.id}`)
        //remove enabled module from mongo
        if(disabledModules.includes(module.toLowerCase())){
            disabledModules.splice(disabledModules.indexOf(module.toLowerCase()))//remove the newly enabled module from the variable
            client.disabledModules.set(`${message.guild.id}`, disabledModules) //update our cache
            client.serverData.set(`${message.guild.id}.disabledModules`, disabledModules) //update mongo
            message.channel.send(`${module} module enabled`) //confirmation
        } else {message.channel.send("Mmmmhm why are you trying to enable that one again?")}
    }
}

exports.config = {
    enabled: true,
    guildOnly: true,
    aliases: [],
    permLevel: "serverAdmin",
    name: "modules",
    description: "List, enable, or disable modules",
    usage: ["[list || enable || disable] [<module name>]"]
};