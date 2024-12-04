exports.run = (client, message, args) => {

  let [channel, ...text] = args.split(" ")

  if (!message.mentions.channels.first()) return message.channel.send("Lmao at least tell me where to say stuff")
  let checkChannel = message.mentions.channels.first().id

  message.guild.channels.cache.get(checkChannel).sendTyping();
  let timeout = text.length * 250
	setTimeout(() => {
		client.channels.cache.get(checkChannel).send({content:`${text.join(" ")}`}).then((message) => {
		});
	}, timeout)
}

exports.config = {
	guildOnly: true,
	aliases: ["mimic", "utter"],
	permLevel: "serverAdmin",
	name: "say",
	description: "Make me say things",
	usage: ["[<#channel>] [<message>]"]
};