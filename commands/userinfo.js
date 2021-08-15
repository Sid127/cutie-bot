const Discord = require("discord.js");
const moment = require("moment-timezone");
require("moment-duration-format");

const status = {
  online: "Online",
  idle: "Idle",
  dnd: "Do Not Disturb",
  offline: "Offline/Invisible"
};

exports.run = async (client, message, args, level) => {
	// set the member object to get the info from, if a user was tagged, prioritize that
	let member;
	// get a random color generator
	let randomColor = "#000000".replace(/0/g, function () { return (~~(Math.random() * 16)).toString(16); });

	if (message.mentions.members.size > 0) {
		member = message.mentions.members.first();
	} else {
		member = message.member;
	}

	// now create the embed object and give it the data it wants
	let embed = new Discord.MessageEmbed()
		.setColor(randomColor)
		.setThumbnail(`${member.user.avatar != null ? member.user.avatarURL() : "https://discordapp.com/assets/dd4dbc0016779df1378e7812eabaa04d.png"}`)
		.setAuthor(`${member.user.tag} (${member.id})`)
		.addField("Nickname:", `${(member.nickname !== null && member.nickname !== undefined) ? `Nickname: ${member.nickname}` : "No nickname"}`, true)
		.addField("Status", `${status[member.presence.status]}`, true)
		.addField("Playing", `${member.presence.activities.state ? `${member.presence.activities.state}` : "Not playing anything."}`, true)
		.addField("Roles", `${member.roles.cache.filter(r => r.id !== message.guild.id).map(roles => `\`${roles.name}\``).join(" **|** ") || "No Roles"}`, true)
		.addField("Joined", `${moment().diff(moment.utc(member.joinedAt), 'days')} Days Ago (Created ${moment.utc(member.user.createdAt).format("MMMM Do YYYY")})`, true)

		message.channel.send({embeds:[embed]});
}

exports.conf = {
	enabled: true,
	guildOnly: true,
	aliases: ["user"],
	permLevel: "User"
};

exports.help = {
	name: "userinfo",
	category: "Miscellaneous",
	description: "Show user information. If no user is mentioned, show yours",
	usage: "userinfo <@user>"
};
