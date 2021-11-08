exports.run = async(client, message, args) => { // eslint-disable-line no-unused-vars
    let [param, member] = args.split(" ")

    if (!message.member.permissions.has('MANAGE_ROLES'))
        return;

    if (message.mentions.members.size === 0)
        return message.reply({content:"please mention a user to verify"});

    let verifyMember = message.mentions.members.first();

    verifyMember.roles.remove(message.guild.roles.cache.find(role => role.name === "unverified"))
    verifyMember.roles.add(message.guild.roles.cache.find(role => role.name === "member"))
    verifyMember.roles.add(message.guild.roles.cache.find(role => role.name === "verified"))

    if (param === "18") {
        verifyMember.roles.add(message.guild.roles.cache.find(role => role.name === "senior citizen"))
    } else {}
}

exports.config = {
	guildOnly: true,
	aliases: ["recruit", "sacrifice"],
	permLevel: "serverAdmin",
	name: "verify",
	category: "Moderation",
	description: "Verifies a user",
	usage: ["[<@user>]"]
};