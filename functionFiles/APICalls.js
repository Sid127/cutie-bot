// module requires
const https = require("https");
const querystring = require("querystring");

// an async API function for EDSM endpoints
module.exports.asyncEDSM = async (endpoint, params = {}) => {
	let callData = await apiCall(`https://www.edsm.net${endpoint}?${querystring.encode(params)}`);
	// if there was data returned, parse that
	callData.data ? callData.data = JSON.parse(callData.data) : ""

	return callData;
}

// an async API function for Elite BGS endpoints
module.exports.asyncEBGS = async (endpoint, params = {}) => {
	let callData = await apiCall(`https://elitebgs.app/api/ebgs/v5${endpoint}?${querystring.encode(params)}`);
	// if there was data returned, parse that
	callData.data ? callData.data = JSON.parse(callData.data) : ""

	return callData;
}

// an async call to get the EDDB.io HTML pages since no good API there
module.exports.asyncEDDBPage = async (endpoint, params = {}) => {
	let callData = await apiCall(`https://eddb.io${endpoint}`);

	return callData;
}

// function that does the actual API call
async function apiCall(endpoint) {
	// create and return a new promise, this way we can await for the response
	return new Promise((resolve, reject) => {
		// make a GET call to the endpoint (which has the query params already added)
		https.get(endpoint, (res) => {
			// if the response is less than 200, or more than 300 something probably went wrong, catch these
			if (res.statusCode < 200 || res.statusCode > 299) {
				// if one of these was found, resolve this with a message showing the code and a "problem" status
				resolve({message: `Server responded with code: ${res.statusCode}`, status: "problem", statusCode: res.statusCode});
			}

			let data = "";

			// on data respose add to the data variable, on end response resolve the promise with the data and an "ok" status
			res.on("data", (chunk) => { data += chunk; }).on("end", () => { resolve({data: data, status: "ok"}); });
		}).on("error", (err) => { console.log(err); });
	});
}
