exports.run = async(client, message, args) => {
    if (!message.member.permissions.has('ADMINISTRATOR'))
        return message.reply({content:"you can't use this command."});

    if (args[0] === "role") {
        if (!message.mentions.roles.first()) return message.channel.send({content:"Please create the role manually and then set it here"});
        await client.settings.set(`${message.guild.id}.birthdayRole`, message.mentions.roles.first().id)
        message.channel.send({content:"Birthday role set!"})
    } else if (args[0] === "channel") {
        await client.settings.set(`${message.guild.id}.birthdayChnl`, message.mentions.channels.first().id)
        message.channel.send({content:"Birthday channel set!"})
    }
}

exports.conf = {
	enabled: true,
	guildOnly: true,
	aliases: [],
	permLevel: "Modmin"
};

exports.help = {
	name: "bd-config",
	category: "Modmin",
	description: "Set up birthday stuff",
	usage: "bd-config role [@birthday role]\nbd-config channel [#birthday channel]"
};