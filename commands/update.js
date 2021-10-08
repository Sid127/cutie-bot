exports.run = async(client, message, args) => { // eslint-disable-line no-unused-vars
    const { spawn } = require("child_process");

    if (args[0] === 'force') {
        const forcePull = spawn('git', [`reset --hard HEAD~${parseInt(args[1])}`], {shell:true})
        const update = spawn(`git`, [`pull origin main`], {shell:true})
        forcePull.stderr.on("data", data => {
            message.channel.send({content: "```"+`${data}`+"```"});
        });
        update.stderr.on("data", data => {
            message.channel.send({content: "```"+`${data}`+"```"});
        });
    } else if (args[0] === 'npm') {
        const npm = spawn(`npm`, [`install`], {shell:true})
        npm.stdout.on("data", data => {
            message.channel.send({content: "```"+`${data}`+"```"});
        });
    } else {
        const update = spawn(`git`, [`pull origin main`], {shell:true})
        update.stderr.on("data", data => {
            message.channel.send({content: "```"+`${data}`+"```"});
        });
    }
};

exports.conf = {
	enabled: true,
	guildOnly: true,
	aliases: [],
	permLevel: "serverAdmin"
};

exports.help = {
	name: "update",
	category: "Modmin",
	description: "Updates the bot",
	usage: "update"
};