// module requires
const https = require("https");
const querystring = require("querystring");
const axios = require("axios");

// Axios calls to different sites for ease of use and way to limit calls
module.exports.AxiosEDSM = async (endpoint, params = {}) => {
	return AxiosCall(`https://edsm.net${endpoint}?${querystring.encode(params)}`)
}

module.exports.AxiosWebPage = async (website, endpoint, params = {}) => {
	return AxiosCall(`${website}${endpoint}`);
}

module.exports.AxiosEBGS = async (endpoint, params = {}) => {
	return AxiosCall(`https://elitebgs.app/api/ebgs/v5${endpoint}?${querystring.encode(params)}`);
}

module.exports.AxiosSpansh = async (endpoint, method, params = {}) => {
	return AxiosCall(`https://www.spansh.co.uk/api${endpoint}`, method, params);
}

module.exports.AxiosImgur = async (endpoint, params = {}) => {
	return AxiosCall(`https://imgur.com${endpoint}`);
}

// async function to do the Axios call itself, with endpoint, method and data handed in, endpoint also includes already urlencoded query params
async function AxiosCall(endpoint, method = "GET", data) {
	return axios({
		url: endpoint,
		method: method,
		data: data
	})
	.then(res => res.data)	// return the request data
	.catch(error => {			// on possible errors, catch those and throw them to the console
		if (error.response) {
			// The request was made and the server responded with a status code that falls out of the range of 2xx
			console.error(error.response.status, error.response.headers);
		} else if (error.request) {
			// The request was made but no response was received
			console.error(error.request);
		} else {
			// Something happened in setting up the request that triggered an Error
			console.error('Error', error.message);
		}
		console.error(error.config);
	});
}
