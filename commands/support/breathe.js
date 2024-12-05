exports.run = (client, message, args) => {
  let breathe_gif = [
  "https://media.giphy.com/media/krP2NRkLqnKEg/200.gif",
  "https://www.duffthepsych.com/wp-content/uploads/2016/07/478Breathe500x500c129revised.gif",
  "https://media.giphy.com/media/PqleouQXdpCfu/giphy.gif"
  ];
  let gif = Math.floor(Math.random() * breathe_gif.length);
  message.channel.send({content:breathe_gif[gif]});
}

exports.config = {
	guildOnly: false,
	aliases: [],
	permLevel: "User",
	name: "breathe",
	description: "Sends a gif to breathe along to",
	usage: []
};
