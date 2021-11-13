exports.run = async (client, message, args) => {
    //set the role
    if (args[0] === "role") {
        if (!message.mentions.roles.first()) return message.channel.send({content:"Please create the role manually and then set it here"});
        await client.serverData.set(`${message.guild.id}.birthdayRole`, message.mentions.roles.first().id)
        message.channel.send({content:"Birthday role set!"})
    //set the channel
    } else if (args[0] === "channel") {
        if (!message.mentions.channels.first().id) return message.reply({content:"You silly goose that's not how you do it"});
        await client.serverData.set(`${message.guild.id}.birthdayChnl`, message.mentions.channels.first().id)
        message.channel.send({content:"Birthday channel set!"})
    }
}