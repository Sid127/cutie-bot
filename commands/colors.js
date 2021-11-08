exports.run = (client, message) => {
  message.channel.send({content:`https://cdn.discordapp.com/attachments/715250117128617988/745580107602591744/flat-design-color-chart.png`})
}

exports.config = {
	guildOnly: true,
	aliases: ["colours"],
	permLevel: "User",
	name: "colors",
	category: "Colors",
	description: "Send a color chart with hex codes",
	usage: []
};