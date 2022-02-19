// module requires
const { Formatters } = require("discord.js");
const { asyncEDSM } = require("../../functionFiles/APICalls.js");

exports.run = async(client, message, args) => {
	// list all possible HGE drops
	let materialsArray = [
		{ material: "Core Dynamics Composites", allegiance: "Federation", state: "Any" },
		{ material: "Proprietary Composites", allegiance: "Federation", state: "Any" },
		{ material: "Imperial Shielding", allegiance: "Empire", state: "Any" },
		{ material: "Improvised Components", allegiance: "Any", state: "Civil Unrest" },
		{ material: "Military Grade Alloys", allegiance: "Any", state: "War" }, // state can also be Civil War
		{ material: "Military Supercapacitors", allegiance: "Any", state: "War" }, // state can also be Civil War
		{ material: "Pharmaceutical Isolators", allegiance: "Any", state: "Outbreak" },
		{ material: "Proto Heat Radiators", allegiance: "Any", state: "Boom" },
		{ material: "Proto Light Alloys", allegiance: "Any", state: "Boom" },
		{ material: "Proto Radiolic Alloys", allegiance: "Any", state: "Boom" }
	]

	// split out the material that's been looked after and system
	let argsSplit = args.split(", ").map(line => line.trim());

	let material = argsSplit[0];
	let refSystem = argsSplit[1] ? argsSplit[1].toLowerCase() : "";
	let radius = parseInt(argsSplit[2]);

	// list all materials if first argument was "list" or if no arguments specified
	if (material.toLowerCase() == "list" || args.length == 0) {
		let output = (
			`== List of all possible materials from an High Grade Emissions signal source. ==\n` +
			`Finding possible systems for specific material can be found by: ${client.prefix}hgemats [material name], [<reference system>]\n\n`)
		for (mat of materialsArray) {
			output += (
				`= ${mat.material} =\n` +
				`Allegiance :: ${mat.allegiance}\n` +
				`State      :: ${mat.state == "War" ? "War or Civil war" : mat.state}\n`
			);
		}
		return message.channel.send(Formatters.codeBlock("asciidoc", output));
	}

	// check if the specified material is in the list, if not, give a response
	let lookingFor = {
		toFind: "",
		value: ""
	};

	if (material) {
		let validMatFound = false;
		let validMaterials = []

		for (mat of materialsArray) {
			validMaterials.push(`\`${mat.material}\``);

			if (mat.material.toLowerCase() == material.toLowerCase()) {
				lookingFor.toFind = mat.allegiance != "Any" ? "allegiance" : "factionState";
				lookingFor.value = mat.allegiance != "Any" ? mat.allegiance : mat.state;
				validMatFound = true;
				break;
			}
		}

		if (!validMatFound) {
			return message.reply(
				`Invalid material name: \`${material}\`.\n`+
				`Valid materials: ${validMaterials.join(", ")}`);
		}
	}

	// have a quick check if refSystem has something in it
	if (refSystem == "") {
		return message.reply(`Forgot to add a reference system? I don't know where to check from now :(`)
	}

	// do some checks to the radius if specified
	radius = (radius && !isNaN(radius)) ? (radius <= 100 ? (radius > 10 ? radius : 10) : 100) : 25;

	// send a temporary message
	let tempMessage = await message.channel.send("Working on gathering data...");

	// get a list of systems from the EDSM api with the default
	let interestingSystems = await asyncEDSM("/api-v1/sphere-systems", {systemName: refSystem, radius: radius, showInformation: 1});

	// check if we have an array back or just the string for no data found
	if (interestingSystems.status !== "ok") {
		console.log(interestingSystems);
		return message.reply("Something went wrong.");
	}

	// check if any data was returned
	if (interestingSystems.data === 0) {
		return message.reply("Doesn't seem like I got any data back");
	}

	// now go through the systems found and find the specific fit
	let systemCandidates = [];

	for (system of interestingSystems.data) {
		if (system.information[lookingFor.toFind]) {
			if (system.information[lookingFor.toFind].toLowerCase().includes(lookingFor.value.toLowerCase())) {
				systemCandidates.push(system)
			}
		}
	}

	// check if any systems were found, if not say to increase the radius
	if (systemCandidates.length == 0) {
		return tempMessage.edit(
			`No systems within distance of: ${radius}Ly of: \`${refSystem}\`.\n` +
			`Try with increasing the search radius (up to max 100Ly)\n` +
			`\`${client.prefix}hgemats [material name], [<reference system>], (<search radius (max 100Ly)>)\``);
	}

	// sort the list according to the distance from reference
	systemCandidates.sort((a, b) => a.distance - b.distance);

	// now create the output and throw in the first 20 found system names
	let output = (`= Possible systems where: "${material}" should be found within: ${radius}Ly.=\n` +
		`${systemCandidates.length > 20 ? "= Limited to 20 closest systems =\n" : ""}` +
		`\nDistance :: SystemName\n`);

	for (let i = 0; i < Math.min(20, systemCandidates.length); i++) {
		output += `\n${systemCandidates[i].distance.toString().padStart(6, " ")}Ly :: ${systemCandidates[i].name}`;
	}

	// and at the end let the user know
	return tempMessage.edit(Formatters.codeBlock("asciidoc", output));
}

exports.config = {
	guildOnly: true,
	aliases: ["hge"],
	permLevel: "User",
	name: "hgemats",
	description: "Lists systems with possible HGE drops",
	usage: ["(list)", "[material name], [<reference system>], (<search radius (max 100Ly)>)"]
};
