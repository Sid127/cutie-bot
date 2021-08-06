exports.run = async(client, message, args, level) => { // eslint-disable-line no-unused-vars
    if (!message.member.permissions.has('ADMINISTRATOR'))
        return;
    const sh = require('shelljs');

    if (args[0] === 'force') {
        sh.exec(`git reset --hard HEAD~${parseInt(args[1])}`)
        var output = sh.exec('git pull origin main').stdout;
        message.channel.send({content:"```" + output + "```"})
    } else if (args[0] === 'npm') {
        sh.exec('npm install')
    } else {
        var output = sh.exec('git pull origin main').stdout;
        message.channel.send({content:"```" + output + "```"})
    }
};

exports.conf = {
	enabled: true,
	guildOnly: true,
	aliases: [],
	permLevel: "Modmin"
};

exports.help = {
	name: "update",
	category: "Modmin",
	description: "Updates the bot",
	usage: "update"
};