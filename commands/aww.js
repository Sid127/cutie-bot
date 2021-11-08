exports.run = (clients, message, args) => {
	const randomPuppy = require('random-puppy');
	randomPuppy('aww')
	    .then(url => {
	        message.channel.send({content:url});
	    })
}

exports.config = {
	guildOnly: true,
	aliases: [],
	permLevel: "User",
	name: "aww",
	category: "Miscellaneous",
	description: "Sends random media from r/aww",
	usage: []
};