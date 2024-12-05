// module requires
const moment = require("moment");
	require('moment-duration-format');

exports.run = (client, message, args) => {
	// check for empty args
	if (args.length === 0) {
		return message.reply("I see no input, so 42?\nPlease give a number of ls, kls or mls with the tag too.");
	}

	// variable to use for checking, all lowercase
	let argsLowerCase = args.toLowerCase();

	// check the start of the args for g or gravity
	let gravity = false;
	if (argsLowerCase.startsWith("g ") || argsLowerCase.startsWith("gravity")) gravity = true;

	// parse out the number for distance
	let tempNumbers = args.match(/[+-]?\d+([\.,]?\d+)?/g);
	if (tempNumbers.length === 0) return message.reply("I find no numbers, would be easier to math with those.");

	let distance = parseFloat(tempNumbers[0].replace(/\,/g, "."));

	// quick check for distance being a number and negative distance
	if (isNaN(distance)) return message.reply("A numeric distance would be useful.");
	if (distance < 0) return message.reply("Negative distance? What black magic are you trying to get me to do?");

	// get the unit given
	let unit = args.toLowerCase().match(/((^$|k|m)?ls)|(ly)/g);
	if (unit.length === 0) message.reply("Some units would be handy, ls, kls, mls or ly.");

	// multiply the number we got
	switch(unit[0]) {
		case "ls": break;
		case "kls": distance *= 1000; break;
		case "mls": distance *= 1000000; break;
		case "ly": distance *= 31557600; break;
	}

	let timeSeconds = distanceToSeconds(gravity, distance);

	message.channel.send(`For a distance of \`${Math.floor(distance).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}\` ls in SuperCruise will take roughly \`${moment.duration(timeSeconds*1000).format(" y [years], M [months], D [days], H [hrs], m [mins], s [secs]")}\` ` +
		`${gravity ? "(between two gravity wells)" : "(from a star out into deep space)"}`);
}

exports.config = {
	guildOnly: true,
	aliases: [],
	permLevel: "User",
	name: "false",
	description: "Calculates rough time for given distance in SuperCruise",
	usage: ["(g || gravity) [<number>ls || kls || mls || ly]"]
};


// this math figured out by the FuelRats: https://github.com/FuelRats/SwiftSqueak/blob/2842331a55a816e2c9a0d4bacc2ef08844faf7ee/Sources/mechasqueak/Extensions/NumberFormatter.swift#L119
function distanceToSeconds (gravity, distance) {
    if (gravity) distance /= 2;

    let seconds = 0.0;
    if (distance < 100000) {
        seconds = 8.9034 * Math.pow(distance, 0.3292);
    } else if (distance < 1907087) {
        // -8*(10 ** -23) * (x ** 4) + 4*(10 ** -16) * (x ** 3) - 8*(10 ** -10) * (x ** 2) + 0.0014 * x + 264.79
        let part1 = -8 * Math.pow(10, -23) * Math.pow(distance, 4);
        let part2 = 4 * Math.pow(10, -16) * Math.pow(distance, 3) - 8 * Math.pow(10, -10) * Math.pow(distance, 2);
        let part3 = 0.0014 * distance + 264.79;
        seconds = part1 + part2 + part3;
    } else seconds = (distance - 5265389.609) / 2001 + 3412;

    if (seconds < 0) return 0;

    if (gravity) seconds *= 2;

    return seconds;
}
