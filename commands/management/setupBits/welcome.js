exports.run = async (client, message, args) => {
    if (!args[0]) return message.channel.send("Okay, welcome how?")
    if (args[0] === "off"){
        await client.serverData.set(`${message.guild.id}.welcomeChnl`, null)
        return message.channel.send("Okay, I'll stay shut from now")
    } else if (args[0] === "show"){
        let chnl = await client.serverData.get(`${message.guild.id}.welcomeChnl`)
        let msg = await client.serverData.get(`${message.guild.id}.welcome`)

        if(!chnl) return message.channel.send("Welcome messages are currently off")
        message.channel.send(`Welcome messages are on and set to <#${chnl}>. Here's how I'll welcome someone:\n\n${msg}`)
    } else {
        args = args.join(" ")
        let [channel, ...welcomeMsg] = args.split(" ")
        if (!message.mentions.channels.first().id) return message.channel.send("Where do I say things again?")
        welcomeMsg = welcomeMsg.join(" ")

        await client.serverData.set(`${message.guild.id}.welcomeChnl`, message.mentions.channels.first().id)
        await client.serverData.set(`${message.guild.id}.welcome`, welcomeMsg)
        message.channel.send("I know what to say when people join now :D")
    }
}