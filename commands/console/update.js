exports.run = async(client, message, args) => { // eslint-disable-line no-unused-vars
    const { exec } = require("child_process");
	const { codeBlock } = require("discord.js");

	let [param, count] = args.split(" ")

    if (param === 'force') {
        exec(`git reset --hard HEAD~${parseInt(count)}`, (err, stdout, stderr) => {
			message.channel.send(codeBlock("bash", stdout));
            message.channel.send(codeBlock("bash", stderr));
        });
    }

	exec(`git pull`, (err, stdout, stderr) => {
		message.channel.send(codeBlock("bash", stdout));
		message.channel.send(codeBlock("bash", stderr));
	});

	if (param === 'npm') {
		exec(`npm ci`, (err, stdout, stderr) => {
			message.channel.send(codeBlock("bash", stdout));
			message.channel.send(codeBlock("bash", stderr));
		});
	}
};

exports.config = {
	guildOnly: true,
	aliases: [],
	permLevel: "botAdmin",
	name: "update",
	description: "Updates the bot",
	usage: []
};
