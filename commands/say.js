exports.run = (client, message, args) => {
  if(!message.member.permissions.has('MANAGE_MESSAGES'))
    return;

  var checkChannel = message.mentions.channels.first().id

  message.guild.channels.cache.get(checkChannel).startTyping();
  var timeout = text.length * 250
	setTimeout(() => {
		client.channels.cache.get(checkChannel).send({content:`${text.join(" ")}`}).then((message) => {
			client.channels.cache.get(checkChannel).stopTyping();
		});
	}, timeout)
}

exports.config = {
	guildOnly: true,
	aliases: ["mimic", "utter"],
	permLevel: "modAssist",
	name: "say",
	category: "Metadata",
	description: "Make me say things",
	usage: "[<#channel>] [<message>]"
};