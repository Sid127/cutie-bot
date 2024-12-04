// module requires
const { codeBlock } = require("discord.js");
const { AxiosSpansh, AxiosEDSM } = require("../../functionFiles/APICalls.js");
const { capitalizeAll } = require("../../functionFiles/helperFunctions.js");

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
		return message.channel.send(codeBlock("asciidoc", output));
	}

	// check if the specified material is in the list, if not, give a response
	let lookingFor = {
		toFind: "",
		value: "",
		material: ""
	};

	if (material) {
		let validMatFound = false;
		let validMaterials = []

		for (mat of materialsArray) {
			validMaterials.push(`\`${mat.material}\``);

			if (mat.material.toLowerCase() == material.toLowerCase()) {
				lookingFor.toFind = mat.allegiance != "Any" ? "allegiance" : "state";
				lookingFor.value = mat.allegiance != "Any" ? mat.allegiance : mat.state;
				lookingFor.material = mat.material;
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

	// send a temporary message
	let tempMessage = await message.channel.send("Working on gathering data...");

	// have a quick check if refSystem has something in it or if it's home
	if (refSystem === "" || refSystem === "home") {
		refSystem = await client.serverData.get(`${message.guild.id}.home.system`);
		if (!refSystem) return tempMessage.edit(`Forgot to add a reference system, and didn't find your home? I don't know where to check from now :(`);
	} else {
		let validData = await AxiosEDSM("/api-v1/system", {systemName: refSystem});
		if (validData.length === 0) return tempMessage.edit(`Reference system isn't known, please choose another one.`);
	}

	// get current date and do the math to get the date 5 days ago using ms
	let currentDate = new Date();
	let dateXDaysAgo = new Date(currentDate - (3 * 86400000));

	// build the axios options
	let axiosOptions = {
		filters: {
			updated_at:{comparison:"<=>",value:[dateXDaysAgo, currentDate]}
		},
		reference_system: capitalizeAll(refSystem.toLowerCase()),
		size: 20,
		sort: [{distance: {direction: "asc"}}]
	}
	axiosOptions.filters[lookingFor.toFind] = {value: [lookingFor.value]};

	// do the axios call and wait for the response
	let interestingSystems = await AxiosSpansh("/systems/search", "POST", axiosOptions);

	// and check if we didn't get any data back
	if (!interestingSystems || interestingSystems.results === 0) {
		return tempMessage.edit(`Didn't find anything around: \`${axiosOptions.reference_system.replace(/\`/g, "")}\``);
	}

	// all the results we got so far should have at least a chance of being right
	let outputData = `= Possible systems where: "${lookingFor.material}" should be found. =\n` +
		`Limited to 20 closest systems around: "${axiosOptions.reference_system}".\n` +
		`\nDistance :: SystemName\n`;

	for (let system of interestingSystems.results) {
		outputData += `\n${system.distance.toFixed(2).padStart(6, " ")}Ly :: ${system.name}`
	}

	// and at the end let the user know
	return tempMessage.edit(codeBlock("asciidoc", outputData));
}

exports.config = {
	guildOnly: true,
	aliases: ["hge"],
	permLevel: "User",
	name: "hgemats",
	description: "Lists systems with possible HGE drops",
	usage: ["(list)", "[material name], [<reference system>|(home)]"]
};
