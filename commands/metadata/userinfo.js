
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
	const { EmbedBuilder } = require("discord.js");
	const moment = require("moment-timezone");

	// set the member object to get the info from, if a user was tagged, prioritize that
	let member = message.mentions.members.first() || message.member;

	// build the embed
	let embed = new EmbedBuilder()
		.setColor("Random")
		.setThumbnail(`${member.user.avatar != null ? member.user.avatarURL() : "https://discordapp.com/assets/dd4dbc0016779df1378e7812eabaa04d.png"}`, true)
		.setTitle(`${member.nickname ? `${member.nickname} (${member.user.tag})` : member.user.tag}`)
		.addFields(
			{ inline: true, name: "Status", value: `${member.presence ? status[member.presence.status] : "I have no idea D:"}` },
			{ inline: true, name: "Roles", value: `${member.roles.cache.filter(role => role.id !== role.guild.id).map(roles => `\`${roles.name}\``).join(" **|** ") || "No roles to show."}` },
			{ name: "Guild joined", value: `<t:${moment(member.joinedAt).unix()}:F> \n${moment().diff(moment.utc(member.joinedAt), 'days')} Days Ago.` },
			{ name: "Account created", value: `<t:${moment(member.user.createdAt).unix()}:F> \n${moment().diff(moment.utc(member.user.createdAt), 'days')} Days Ago.` }
		)

	// create activities object if available
	if (member.presence) {
		let activities = member.presence.activities.filter(elem => elem.type.toLowerCase() !== "custom")
		for (activity of activities) {
			activity !== undefined ? embed.addFields({ name: status[activity.type], value: `${activity.name}\n\`${activity.details}\n${activity.state}\``, inline: true}) : {}
		}
	}

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
