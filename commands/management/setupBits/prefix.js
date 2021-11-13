exports.run = async (client, message, args) => {
    if(!args[0])return message.channel.send("You know I need a prefix to work, right?")
    if(args[0] === client.config.prefix){
        client.cache[message.guild.id].prefix = "" //update our local cache
        await client.serverData.set(`${message.guild.id}.prefix`, "")//update mongo
        let nick = message.guild.me.displayName.replace(/ *\[[^\]]*]/, '')
        message.guild.me.setNickname(`${nick}`)
        message.channel.send(`Done! New server prefix is \`${args[0]}\``)
    } else {
        client.cache[message.guild.id].prefix = args[0] //update our local cache
        await client.serverData.set(`${message.guild.id}.prefix`, args[0])//update mongo
        let nick = message.guild.me.displayName.replace(/ *\[[^\]]*]/, '')
        message.guild.me.setNickname(`${nick} [${args[0]}]`)
        message.channel.send(`Done! New server prefix is \`${args[0]}\``)
    }
}