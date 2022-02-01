exports.run = async(client, message) => {
	if (message.channel.id !== client.hardcoded.logDumpChnl) return message.channel.send("Excuse me, but, did you forget where to use this?")

	//dump the whole file and exit quietly
	message.channel.send({content: "Here you go chief, the whole log as requested o7:",
			files: [{
				attachment: "./out.log",
				name: "out.log"

			},
			{
				attachment: "./err.log",
				name: "err.log"
			}]
		})
}

exports.config = {
	guildOnly: true,
	aliases: [],
	permLevel: "botAdmin",
	name: "logdump",
	description: "Downloads the error log",
	usage: []
};
