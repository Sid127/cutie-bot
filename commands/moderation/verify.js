exports.run = async(client, message, args) => { // eslint-disable-line no-unused-vars
    let [param, member] = args.split(" ")

    if (message.mentions.members.size === 0)
        return message.reply({content:"please mention a user to verify"});

    let verifyMember = message.mentions.members.first();

    let autorole = await client.serverData.get(`${message.guild.id}.autoRole`)
    for (role of autorole){
        member.roles.remove(role).catch(console.error);
    }

    let verifyroles = await client.serverData.get(`${message.guild.id}.verifyRole`)
    for (role of verifyroles){
        member.roles.add(role).catch(console.error);
    }

    if (param === "18") {
        let ageroles = await client.serverData.get(`${message.guild.id}.verify18Role`)
        for (role of ageroles){
            member.roles.add(role).catch(console.error);
        }
    }
}

exports.config = {
	guildOnly: true,
	aliases: ["recruit", "sacrifice"],
	permLevel: "serverAdmin",
	name: "verify",
	description: "Verifies a user",
	usage: ["[<@user>]"]
};