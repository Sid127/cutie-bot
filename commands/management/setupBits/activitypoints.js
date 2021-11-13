exports.run = async(client, message, args) => {
    if(args[0] === "disabled"){
        client.cache[message.guild.id].activityLeaderboard = args[0]//update our local cache
        await client.serverData.set(`${message.guild.id}.activityLeaderboard`, args[0])//update mongo
        message.channel.send("Activity based points system disabled")
    } else if (args[0] === "enabled"){
        client.cache[message.guild.id].activityLeaderboard = args[0]//update our local cache
        await client.serverData.set(`${message.guild.id}.activityLeaderboard`, args[0])//update mongo
        message.channel.send("Activity based points system enabled")
    }
}