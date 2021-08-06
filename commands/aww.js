exports.run = (clients, message, args) => {
	const randomPuppy = require('random-puppy');
	randomPuppy('aww')
	    .then(url => {
	        message.channel.send({content:url});
	    })
}

exports.conf = {
	enabled: true,
	guildOnly: true,
	aliases: [],
	permLevel: "User"
};

exports.help = {
	name: "aww",
	category: "Miscellaneous",
	description: "Sends random media from r/aww",
	usage: "aww"
};