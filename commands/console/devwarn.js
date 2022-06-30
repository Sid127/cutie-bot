exports.run = async(client, message, args) => {
    const { Client, MessageEmbed } = require('discord.js');
    
    let [srvr, ...mail] = args.split(" ")
    
    //put the anon message in a neat little embed
    const embed = new MessageEmbed()
        .setColor(0xffd1dc)
        .setTitle("Support Server")
        .setThumbnail(message.guild.me.avatarURL())
        .setDescription(`${mail.join(" ")}`)
        .setURL("https://discord.gg/pDrmgrY2tK")
        .setFooter({text: "This is not an auto-generated message, but replies are not being monitored. For any questions, contact us at our support server"});

    if(srvr === "all"){
        let guilds = await client.serverData.keys
        sentOwners = []
        for (g of guilds) {
            //don't run this block if we're not in that guild
            if (!client.guilds.cache.get(g)) continue
            client.guilds.cache.get(g).fetchOwner().then(owner => {
                if (!sentOwners.includes(owner.id)){
                    owner.send({embeds: [embed]})
                    sentOwners.push(owner.id)
                }
            })
        }
        return;
    } else {
        client.guilds.cache.get(srvr).fetchOwner().then(owner => {
            owner.send({embeds: [embed]})
        })
    }
}

exports.config = {
	guildOnly: false,
	aliases: [],
	permLevel: "botAdmin",
	name: "devwarn",
	description: "Contact server owners per server or all at once",
	usage: ["[server ID | 'all'] [<message>]"]
};