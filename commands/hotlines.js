exports.run = (client, message, args) => {
  message.channel.send({content:"mental health related hotlines worldwide: <https://www.7cups.com/wiki/hotlines-crisis-resources/> \nsuicide hotlines worldwide: <https://www.suicidestop.com/call_a_hotline.html> \nemergency numbers worldwide: <https://en.wikipedia.org/wiki/List_of_emergency_telephone_numbers>"});  
}

exports.config = {
	guildOnly: true,
	aliases: [],
	permLevel: "User",
	name: "hotlines",
	category: "Support",
	description: "Send a list of hotlines worldwide",
	usage: []
};