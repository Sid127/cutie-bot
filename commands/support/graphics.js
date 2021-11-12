exports.run = (client, message, args) => {
  var graphics_img = [
  "https://i.redd.it/58f7d2z4dgv01.jpg",
  "https://i.pinimg.com/originals/0a/97/12/0a9712edbaa154f6ff5e00fe29e45f91.jpg",
  "http://positivelypresent.com/.a/6a011168668cad970c0223c846f8c4200c-450wi",
  "http://positivelypresent.com/.a/6a011168668cad970c01b8d2cb8658970c-450wi",
  "https://i.pinimg.com/originals/13/3d/fb/133dfb2b5f930e2f85e9faa763bd66eb.jpg",
  "https://i.pinimg.com/originals/43/7f/8b/437f8b0b502f5f968235b31166d06a05.jpg",
  "https://static1.squarespace.com/static/57f5632e893fc04e80091c4b/t/58f6b4dce4fcb54285fb71a8/1492563173142/six-ways-to-practice-grounding?format=500w",
  "https://i.imgur.com/JvEO7KS.png"
  ];
  var img = Math.floor(Math.random() * graphics_img.length);
  message.channel.send({content:graphics_img[img]});
}

exports.config = {
	guildOnly: true,
	aliases: [],
	permLevel: "User",
	name: "graphics",
	description: "Send a graphic with coping tips",
	usage: []
};