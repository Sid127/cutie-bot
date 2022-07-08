exports.run = (client, message, args) => {
  let distraction = [
  "https://www.youtube.com/watch?v=NwlwJjelgzs",
  "https://www.youtube.com/watch?v=Ikw5HhxC5UM&t=131s",
  "https://www.youtube.com/watch?v=5_sfnQDr1-o",
  "https://www.youtube.com/watch?v=Cn2sBJ4B1kc&t=449s",
  "https://www.youtube.com/watch?v=SB-qEYVdvXA",
  "https://www.youtube.com/watch?v=zjIqSEJxiaU",
  "https://www.youtube.com/watch?v=jETaGralXg4",
  "https://www.youtube.com/watch?v=0BR9H9PaDoQ",
  "https://www.youtube.com/watch?v=Tpq0n3Pk5ts",
  "https://www.youtube.com/watch?v=Fv5MZFWn7lE",
  "https://www.youtube.com/watch?v=hPKab2d4_Xw",
  "https://www.youtube.com/watch?v=HRwiPJkm1WE"
  ];
  let vid = Math.floor(Math.random() * distraction.length);
  message.channel.send({content:distraction[vid]});
}

exports.config = {
	guildOnly: true,
	aliases: ["distract me"],
	permLevel: "User",
	name: "distractme",
	description: "Send a cute animal video to help you distract yourself",
	usage: []
};