//function for grabbing a list of whitelisted roles
module.exports.blacklistChck = async(client, message, member) => {
	//remove blacklisted roles
	let hiddenRoles = await client.settings.get(`${message.guild.id}.hiddenRoles`);
	let blacklistPfx = await client.settings.get(`${message.guild.id}.blacklistPfx`);
	matchString = "("
	for (pfx of blacklistPfx){
		//regex to check if starting is alphanumeric
		if(!pfx.match(/^[a-z0-9]+$/i)){
			blacklistPfx.indexOf(pfx) === blacklistPfx.length - 1 ?    matchString += `\\${pfx}` + ")" : matchString += `\\${pfx}` + "|"
		} else {
			blacklistPfx.indexOf(pfx) === blacklistPfx.length - 1 ?    matchString += pfx + "|" : matchString += pfx + ")"
		}
	}

	return member.roles.cache.filter(r => r.id !== message.guild.id && !hiddenRoles.includes(r.id) && !r.name.match(`${matchString}.*`)).map(roles => `\`${roles.name}\``).join(" **|** ")
}

