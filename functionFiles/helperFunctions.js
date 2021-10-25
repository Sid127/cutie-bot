// modular function to get data from mongodb
module.exports.mongoGet = async (client, dbKey, valueKeys) => {
	returnMap = new Map()
	if (dbKey.includes("-")){
		for (k of valueKeys){
			returnMap.set(k, await client.peopleData.get(`${dbKey}.${k}`))
		}
	} else {
		for (k of valueKeys){
			data = await client.serverData.get(`${dbKey}.${k}`)
			returnMap.set(k, data)
		}
	}
	return returnMap
}

// function to return a collection/map of whitelisted roles a user has
module.exports.blacklistChck = async(blacklistMap, mmbrRolesCache) => {
	prefixes = blacklistMap.get('blacklistPfx')
	roles = blacklistMap.get('hiddenRoles')

	if(prefixes.length === 0){
		return mmbrRolesCache.filter(r => r.id !== r.guild.id && (roles && !roles.includes(r.id)))
	} else {
		// regex constructor to create match string for prefixes
		matchString = []
		for (pfx of prefixes){
			//regex to check if starting is alphanumeric
			pfx.match(/^[a-z0-9]+$/i) ? matchString.push(pfx) : matchString.push(`\\${pfx}`)
		}
		matchString = matchString.join("|")

		return mmbrRolesCache.filter(r => r.id !== r.guild.id && (roles && !roles.includes(r.id)) && !r.name.match(`${matchString}.*`))
	}
}