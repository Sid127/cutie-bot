// module requires
const { AxiosImgur } = require("../../functionFiles/APICalls.js");

exports.run = async (clients, message, args) => {
	// do the Imgur call to get all posts
	let returnData = await AxiosImgur("/r/aww/hot.json");

	// get random post from 0 to length - 1
	let randomPost = returnData.data[Math.floor(Math.random() * (returnData.data.length - 1))];

	// send the found post to the channel
	message.channel.send({content: `http://imgur.com/${randomPost.hash}${randomPost.ext.replace(/\?.*/, '')}`});
}

exports.config = {
	guildOnly: true,
	aliases: [],
	permLevel: "User",
	name: "aww",
	description: "Sends random media from r/aww to act as a distraction",
	usage: []
};
