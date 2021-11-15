exports.run = (client, message, args) => {
  if(!message.member.permissions.has('MANAGE_MESSAGES'))
    return;

  let [channel, ...text] = args.split(" ")

  var checkChannel = message.mentions.channels.first().id

  message.guild.channels.cache.get(checkChannel).sendTyping();
  var timeout = text.length * 250
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