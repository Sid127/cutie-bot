exports.run = async (client, message, args) => {
    const { EmbedBuilder } = require("discord.js")

    if(args[0] === "off") {
        await client.serverData.set(`${message.guild.id}.anonChnl`, null);
        return message.channel.send({content:"Anonymous channel unset"})
    }

    // grab the mentioned channel
    let channel = message.mentions.channels.first();
    if (!channel) return message.reply({content:"You silly goose that's not how you do it"});
    let confessChnl = channel.id;

    // save to mongo before confirming it to the user
    await client.serverData.set(`${message.guild.id}.anonChnl`, confessChnl);

    // confirm it to the user with usage example
    let embed = new EmbedBuilder()
        .setColor(0xffd1dc)
        .setDescription(`Anonymous channel set to <#${channel.id}>. DM me a message like this:\n\n ${client.config.prefix} anon ${message.guild.id} [message]`)
    client.channels.cache.get(confessChnl).send({embeds: [embed]})
}