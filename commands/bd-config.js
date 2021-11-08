exports.run = async(client, message, args) => {

    let [param, config] = args.split(" ")

    //set the role
    if (param === "role") {
        if (!message.mentions.roles.first()) return message.channel.send({content:"Please create the role manually and then set it here"});
        await client.serverData.set(`${message.guild.id}.birthdayRole`, message.mentions.roles.first().id)
        message.channel.send({content:"Birthday role set!"})
    //set the channel
    } else if (param === "channel") {
        await client.serverData.set(`${message.guild.id}.birthdayChnl`, message.mentions.channels.first().id)
        message.channel.send({content:"Birthday channel set!"})
    }
}

exports.config = {
	guildOnly: true,
	aliases: [],
	permLevel: "serverAdmin",
	name: "bd-config",
	category: "Modmin",
	description: "Set up birthday stuff",
	usage: ["role [@birthday role]", "channel [#birthday channel]"]
};