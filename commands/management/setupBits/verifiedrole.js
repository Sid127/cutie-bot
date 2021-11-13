exports.run = async(client, message, args) => {
    if(!message.mentions.roles) return message.channel.send("Yeah, what roles?")
    let roles = message.mentions.roles.map(role => role.id)
    //optional param for age verification role
    if(args[0] === "agegate"){
        await client.serverData.set(`${message.guild.id}.verify18Role`, roles)
        return message.channel.send(`Age verification role${message.mentions.roles.length === 1 ? "" : "s"} set`)
    }
    await client.serverData.set(`${message.guild.id}.verifyRole`, roles)
    message.channel.send(`Verified member role${message.mentions.roles.length === 1 ? "" : "s"} set`)
}