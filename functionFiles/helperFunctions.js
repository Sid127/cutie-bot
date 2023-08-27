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
    let sortOrder = 1;

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

const checkForStations = (serviceSystem, serviceName, homeCoords, serviceCoords) => {
	if (serviceSystem !== undefined) {
		for (station of serviceSystem.stations) {
			if (station.otherServices.includes(serviceName)) {
				return {
					system: serviceSystem.name,
					systemID: serviceSystem.id,
					station: station.name,
					stationID: station.id,
					distanceToArrival: station.distanceToArrival,
					distanceHome: distanceCalc(homeCoords.coords, serviceCoords.coords, 2)
				}
			}
		}
		return false;
	}
}

// function to find and split the message leaving as close to maxLength in one "block"
const splitMessage = (text, { maxLength = 1750, char = '\u200b'} = {}) => {
	// check if test is shorter than maxLength given, then just return it back in an array
	if (text.length < maxLength) return [text];

	// check if maxLength is more than 2000, if so, throw error
	if (maxLength > 2000) throw new Error("maxLength more than 2000 characters.");

	// split up the whole message by the separator char, filter out empty elements
	const splitText = text.trim().split(char).filter(elem => elem.trim().length > 0);

	// check if there are chunks longer than maxLength, if so, error out
	if (splitText.some(elem => elem.length > maxLength)) throw new Error(`Found chunks longer than maxLength of: "${maxLength}"`);

	// create two variables, one array for holding all the return chunks, the other for holding the stiched together part
	let returnChunks = [];
	let stichedChunk = "";

	// loop over all the splitText chunks, stich together enough of those to go over maxLength
	for (const chunk of splitText) {
		// check if adding the chunk to stichedChunk would go over maxLength chars, if so, add currently stored chunk to return
		if (stichedChunk && (stichedChunk + char + chunk).length > maxLength) {
			// add to return array and create new stichedChunk empty string
			returnChunks.push(stichedChunk);
			stichedChunk = "";
		}

		// add in the current chunk to stichedChunk, and add in char if not empty
		stichedChunk += (stichedChunk && stichedChunk.lenght !== 0 ? char : "") + chunk;
	}

	// add in the last bit by pushing it on as last
	returnChunks.push(stichedChunk);

	// return the final things back
	return returnChunks;
}

module.exports = {distanceCalc, capitalizeString, capitalizeAll, dynamicSort, checkForStations, splitMessage}
