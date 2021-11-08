exports.run = async(client, message, args) => {
    if (!message.guild) {
        const { Client, MessageEmbed } = require('discord.js');
        
        let [srvr, ...confession] = args.split(" ")
        
        //put the anon message in a neat little embed
        const embed = new MessageEmbed()
            .setColor(0xffd1dc)
            .setDescription(`${confession.join(" ")}`)
            .setTimestamp();

        //grab anon settings from mongo
        if (await client.serverData.get(`${srvr}.anonChnl`) === null) return;
        const sendSrvr = await client.serverData.get(`${srvr}.guild`)
        const sendChnl = await client.serverData.get(`${srvr}.anonChnl`)

        //send the anon embed
        if (srvr === sendSrvr) {
            client.channels.cache.get(sendChnl).send({embeds: [embed]}).catch(console.error);
        }
    } else {}
}

exports.config = {
	guildOnly: false,
	aliases: [],
	permLevel: "User",
	name: "anon",
	category: "Miscellaneous",
	description: "Sends an anonymous message - DM command only",
	usage: ["Check the anon channel for usage info"]
};