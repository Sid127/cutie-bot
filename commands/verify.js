exports.run = async(client, message, args, level) => { // eslint-disable-line no-unused-vars
    if (!message.member.permissions.has('MANAGE_ROLES'))
        return;

    if (message.mentions.members.size === 0)
        return message.reply({content:"please mention a user to verify"});

    let verifyMember = message.mentions.members.first();

    verifyMember.roles.remove(message.guild.roles.cache.find(role => role.name === "unverified"))
    verifyMember.roles.add(message.guild.roles.cache.find(role => role.name === "member"))
    verifyMember.roles.add(message.guild.roles.cache.find(role => role.name === "verified"))

    if (args[0] === "18") {
        verifyMember.roles.add(message.guild.roles.cache.find(role => role.name === "senior citizen"))
    } else {}
}

exports.conf = {
	enabled: true,
	guildOnly: true,
	aliases: ["recruit", "sacrifice"],
	permLevel: "serverAdmin"
};

exports.help = {
	name: "verify",
	category: "Modmin",
	description: "Verifies a user",
	usage: "verify [@user]"
};