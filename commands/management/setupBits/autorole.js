exports.run = async (client, message) => {
    if(!message.mentions.roles) return message.channel.send("Yeah, what roles?")
    let roles = message.mentions.roles.map(role => role.id)

    //push to mongo
    await client.serverData.set(`${message.guild.id}.autoRole`, roles)

    message.channel.send(`Alrighty, ${message.mentions.roles.length === 1 ? "that role" : "those roles"} will be given to a new user`)
}