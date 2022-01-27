// function for calculating distance in 3d space
const distanceCalc = (point1, point2, decimalPoints = 2) => {
	return Math.sqrt(Math.pow((point1.x - point2.x), 2) +
		Math.pow((point1.y - point2.y), 2) +
		Math.pow((point1.z - point2.z), 2)).toFixed(decimalPoints);
}

// function to return the string with a capital first letter
const capitalizeString = (string) => {
	return string && string.charAt(0).toUpperCase() + string.slice(1);
}

const capitalizeAll = (string) => {
	return string.replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase());
}

// helper function for sorting
const dynamicSort = (property) => {
    var sortOrder = 1;

    if (property[0] === "-") {
        sortOrder = -1;
        property = property.substr(1);
    }

    return function (a,b) {
        if (sortOrder == -1){
            return b[property].localeCompare(a[property]);
        } else {
            return a[property].localeCompare(b[property]);
        }
    }
}

// modular function to get data from mongodb
const mongoGet = async (client, dbKey, valueKeys) => {
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
const blacklistChck = async(blacklistMap, mmbrRolesCache) => {
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

const checkForStations = (serviceSystem, serviceName, homeCoords, serviceCoords) => {
	if(serviceSystem !== undefined){
		for(station of serviceSystem.data.stations) {
			if(station.otherServices.includes(serviceName)){
				return retStation = `${serviceSystem.data.name}, ${station.name}, ${station.distanceToArrival.toFixed(1)} Ls, ${distanceCalc(homeCoords.data.coords, serviceCoords.data.coords, 2)} Ly`
			}
		}
		if(!retStation) return false
	}
}

module.exports = {distanceCalc, capitalizeString, capitalizeAll, dynamicSort, mongoGet, blacklistChck, checkForStations}
