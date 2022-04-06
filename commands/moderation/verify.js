exports.run = async(client, message, args) => { // eslint-disable-line no-unused-vars
    let [param, member] = args.split(" ")

    if (message.mentions.members.size === 0)
        return message.reply({content:"please mention a user to verify"});

    let verifyMember = message.mentions.members.first();

    let autorole = await client.serverData.get(`${message.guild.id}.autoRole`)
    
    if (autorole){
        for (role of autorole){
            verifyMember.roles.remove(role).catch(console.error);
        }
    }

    let verifyroles = await client.serverData.get(`${message.guild.id}.verifyRole`)
    for (role of verifyroles){
        verifyMember.roles.add(role).catch(console.error);
    }

    if (param === "18") {
        let ageroles = await client.serverData.get(`${message.guild.id}.verify18Role`)
        for (role of ageroles){
            verifyMember.roles.add(role).catch(console.error);
        }
    }

    message.channel.send("Member verified :D")
}

exports.config = {
	guildOnly: true,
	aliases: ["recruit", "sacrifice"],
	permLevel: "modAssist",
	name: "verify",
	description: "Verifies a user",
	usage: ["(18) [<@user>]"]
};
