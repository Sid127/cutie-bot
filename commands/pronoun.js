exports.run = async(client, message, args, level) => {
    const {Formatters} = require("discord.js");

    var fs = require("fs")
    var argu = ""
    for (var i = 1; i < args.length; i++) {
        if (i == args.length - 1)
            argu += args[i];
        else
            argu += args[i] + " ";
    }
    if (!args[0]) {
        var rankData = fs.readFileSync("./commandStorage/pronouns.txt", "utf8")
        message.channel.send(Formatters.codeBlock('asciidoc', "== Available Pronouns ==\n" + rankData))
        return
    }
    if (args[0] == "create") {
        if (!args[1]) {
            message.channel.send({content:"I need a name of a role to make."})
            return
        }
        if (message.member.hasPermission('ADMINISTRATOR')) {
            message.guild.roles.create({
                data: {
                    name: argu,
                    color: 0,
                }
            })
            var rankData = fs.readFileSync("./commandStorage/pronouns.txt", "utf8")
            rankData += "\n" + argu
            fs.writeFileSync("./commandStorage/pronouns.txt", rankData)
            message.channel.send({content:"Created the Pronoun Role " + argu})
        } else {
            message.channel.send({content:"You need to be a moderator to create or delete pronouns."})
            return
        }

    } // End of Create

    if (args[0] == "list") {
        var rankData = fs.readFileSync("./commandStorage/pronouns.txt", "utf8")
        message.channel.send(Formatters.codeBlock('asciidoc', "== Available Pronouns ==\n" + rankData))
        return
    }

    if (args[0] == "delete") {
        if (message.member.hasPermission('ADMINISTRATOR')) {
            var rankData = fs.readFileSync("./commandStorage/pronouns.txt", "utf8")
            if (rankData.includes(argu)) {
                message.guild.roles.cache.find(role => role.name === argu).delete();
                rankData = rankData.replace("\n" + argu, "")
                fs.writeFileSync("./commandStorage/pronouns.txt", rankData)
                message.channel.send({content:"Deleted the pronoun role"})
                return
            } else {
                message.channel.send({content:"I cannot delete that rank!"})
                return
            }
        }
    } else if (!args[1]) {
        message.channel.send({content:"I need a pronoun role to delete!"})
        return
    } else {
        message.channel.send({content:"You need to be a moderator to create or delete pronoun role."})
        return
    }

    var theRank = ""
    for (var i = 0; i < args.length; i++) {
        if (i == args.length - 1)
            theRank += args[i];
        else
            theRank += args[i] + " ";
    }
    var rankData = fs.readFileSync(__dirname + "/../commandStorage/pronouns.txt", "utf8")
    if (rankData.toLowerCase().includes(theRank.toLowerCase())) {
        let role = message.guild.roles.cache.find(r => r.name.toLowerCase() === theRank.toLowerCase())
        if (message.member.roles.cache.find(r => r.name.toLowerCase() === theRank.toLowerCase())) {
            message.member.roles.remove(role);
            message.channel.send({content:"The role was removed from you: " + role.name})
        } else {
            message.member.roles.add(role)
            message.channel.send({content:"The role was added to you: " + role.name})
        }

    }

};

exports.conf = {
	enabled: true,
	guildOnly: true,
	aliases: ["pronouns", "my pronouns are"],
	permLevel: "User"
};

exports.help = {
	name: "pronoun",
	category: "Miscellaneous",
	description: "Set your pronouns from a preset list",
	usage: "pronoun <pronouns>"
};