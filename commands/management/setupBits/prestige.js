exports.run = async(client, message, args) => {
    if (!args[0]) return message.channel.send("I really dunno what you want")
                
    //extract our data
    let [level, role] = args[0].split(" ")
    if(!parseInt(level)) return message.channel.send("I need you to tell me the level as an integer")
    level = parseInt(level)

    //push to mongo
    await client.serverData.set(`${message.guild.id}.prestigeLevel`, level)
    await client.serverData.set(`${message.guild.id}.prestigeRole`, message.mentions.roles.first().id)

    message.channel.send(`Alrighty, ${message.mentions.roles.first().name} role will be awarded when a user reaches level ${level} on the leaderboard`)
}
