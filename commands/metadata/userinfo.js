const Discord = require("discord.js");
const moment = require("moment-timezone");
require("moment-duration-format");

const status = {
  online: "Online",
  idle: "Idle",
  dnd: "Do Not Disturb",
  offline: "Offline/Invisible"
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
		.setAuthor(`${member.user.tag} (${member.id})`)
		.addField("Nickname:", `${(member.nickname !== null && member.nickname !== undefined) ? `Nickname: ${member.nickname}` : "No nickname"}`, true)
		.addField("Status", `${member.presence ? status[member.presence.status] : "I have no idea D:"}`, true)
		.addField("Playing", `${member.presence ? `${member.presence.activities.state}` : "Not playing anything."}`, true)
		.addField("Roles", `${whitelistRoles.map(roles => `\`${roles.name}\``).join(" **|** ") || "No Roles"}`, true)
		.addField("Joined", `${moment().diff(moment.utc(member.joinedAt), 'days')} Days Ago (Created ${moment.utc(member.user.createdAt).format("MMMM Do YYYY")})`, true)

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
