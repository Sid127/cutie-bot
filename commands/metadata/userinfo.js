const Discord = require("discord.js");
const moment = require("moment-timezone");
require("moment-duration-format");

const status = {
  online: "Online",
  idle: "Idle",
  dnd: "Do Not Disturb",
  offline: "Offline/Invisible",
  PLAYING: "Playing",
  STREAMING: "Streaming",
  LISTENING: "Listening to",
  WATCHING: "Watching"
};

exports.run = async (client, message) => {

	const { blacklistChck, mongoGet } = require("../../functionFiles/helperFunctions.js")

	// set the member object to get the info from, if a user was tagged, prioritize that
	let member;
	message.mentions.members.size > 0 ? member = message.mentions.members.first() : member = message.member

	let whitelistRoles = await blacklistChck(await mongoGet(client, message.guild.id, ["blacklistPfx", "hiddenRoles"]), member.roles.cache)

	// now create the embed object and give it the data it wants
	let embed = new Discord.MessageEmbed()
		.setColor('RANDOM')
		.setThumbnail(`${member.user.avatar != null ? member.user.avatarURL() : "https://discordapp.com/assets/dd4dbc0016779df1378e7812eabaa04d.png"}`)
		.setAuthor({name: `${member.user.tag} (${member.id})`})
		.addField("Nickname", `${(member.nickname !== null && member.nickname !== undefined) ? `Nickname: ${member.nickname}` : "No nickname"}`, true)
		.addField("Status", `${member.presence ? status[member.presence.status] : "I have no idea D:"}`, true)
	let activities = member.presence.activities.filter(elem => elem.type.toLowerCase() !== "custom")
	for (activity of activities) {
		activity !== undefined ? embed.addField(status[activity.type], `${activity.name}\n\`${activity.details}\n${activity.state}\``, true) : {}
	}
		embed.addField("Roles", `${whitelistRoles.map(roles => `\`${roles.name}\``).join(" **|** ") || "No Roles"}`, true)
		embed.addField("Joined", `<t:${moment(member.joinedAt).unix()}>, ${moment().diff(moment.utc(member.joinedAt), 'days')} Days Ago\n(Created <t:${moment(member.user.createdAt).unix()}>, ${moment().diff(moment.utc(member.user.createdAt), 'days')} Days Ago)`, true)

	message.channel.send({embeds:[embed]});
}

exports.config = {
	guildOnly: true,
	aliases: ["user"],
	permLevel: "User",
	name: "userinfo",
	description: "Show user information. If no user is mentioned, show yours",
	usage: ["(<@user>)"]
};
