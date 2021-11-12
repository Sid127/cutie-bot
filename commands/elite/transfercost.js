// module requires
const {Formatters} = require("discord.js");

exports.run = async(client, message, args) => {
	// check if args empty
	if (args.trim().length === 0) {
		return message.reply("Hey, you know math is easier with numbers? I'd like a number for \`lightyears\` and a number for \`ship rebuy cost\`, separated by a comma...");
	}

	// split the args with commas, mapping over it with parsing each value and just taking first two
	let [lightyears, shipRebuy, ...rest] = args.split(",").map(value => parseFloat(value.trim().replace(/ /g, "")));

	// check if rest has the first index as a number
	if (typeof(rest[0]) === "number" && !isNaN(rest[0])) {
		return message.reply("Did you use comma as the decimal separator? Use a dot instead, please.");
	}

	// check if numbers are less than or equal to 0, in a odd way
	if (Math.sign(lightyears) !== 1 || Math.sign(shipRebuy) !== 1) {
		return message.reply("Positive numbers please, you wouldn't go backwards in space and doubt you'd get paid to blow up the ship either...");
	}

	// do the math to get the cost and the time it takes
	let cost = Math.round((.5 * shipRebuy) * (lightyears / 400)).toLocaleString("en-CA");
	let time = new Date(((lightyears * 9.75) + 300).toFixed(2) * 1000).toISOString().substr(11, 8);

	// do send the calculated data back to the user
	message.channel.send(Formatters.codeBlock("asciidoc",
		`== Ship transfer time and cost estimates ==\n` +
		`Distance :: ${lightyears.toLocaleString("en-CA")} Ly.\n` +
		`Rebuy    :: ${shipRebuy.toLocaleString("en-CA")} Cr.\n\n` +
		`Cost     :: ${cost} Cr.\n` +
		`Time     :: ${time} (HH:MM:SS)`
	));
};

exports.config = {
	guildOnly: true,
	aliases: ["cost"],
	permLevel: "User",
	name: "transfercost",
	description: "Approximates how much your transfer cost will be.",
	usage: ["[<ly>], [<ship rebuy cost>]"]
};
