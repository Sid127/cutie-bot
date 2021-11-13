exports.run = async(client, message, args) => {
    const { Formatters } = require("discord.js")
    const { asyncEDSM } = require("../../../functionFiles/APICalls.js");
    const { checkForStations } = require('../../../functionFiles/helperFunctions');


    if(args[0] === "template" || !args[0]){ // give a way to provide the template
        let template = `{\n\t"home": "<system name>",\n\t"station": "<name>",\n\t${['"encodedTrader"', '"manufacturedTrader"', '"rawTrader"', '"guardianBroker"', '"humanBroker"', '"IFactor"', '"fcVendor"','"fcAdmin"'].join(': "<nearest system>",\n\t')}: "<nearest system>"\n} `
        message.channel.send("Copy and paste the template below as the argument for the `setup home` command. Do NOT put it in a code block, and make sure to remove the input hints (<like this, including angle brackets>) even if you aren't providing that system name.\nYes, you may provide just one, all of them, or a mix of some o7")
        message.channel.send(Formatters.codeBlock("json", template))
    } else { // 
        let tempMessage = await message.channel.send("Hang tight, this is gonna take a while...");

        //initialise mongo side storage
        client.serverData.ensure(`${message.guild.id}.home`, {
            homeSys: "",
            homeStation: "",
            encTrd: "",
            manfTrd: "",
            rawTrd: "",
            grdBrk: "",
            hmnBrk: "",
            iF: "",
            fcv: "",
            fca: ""
        })

        if(args.join(" ").match("(<|>|system|name|nearest)")) return tempMessage.edit("I TOLD you to remove the text hints >:(")
        let data = JSON.parse(args.join(" ").replace(/(\r\n|\n|\r|\t)/gm, "")) // create json

        //make all our station data API calls at once
        let [home, homeStation, encodedTrader, manufacturedTrader, rawTrader, guardianBroker, humanBroker, IFactor, fcVendor, fcAdmin] = await Promise.all([
            data.home ? asyncEDSM('/api-system-v1/stations', {"systemName": data.home}) : undefined,
            data.station ? data.station : undefined,
            data.encodedTrader ? asyncEDSM('/api-system-v1/stations', {"systemName": data.encodedTrader}) : undefined,
            data.manufacturedTrader ? asyncEDSM('/api-system-v1/stations', {"systemName": data.manufacturedTrader}) : undefined,
            data.rawTrader ? asyncEDSM('/api-system-v1/stations', {"systemName": data.rawTrader}) : undefined,
            data.guardianBroker ? asyncEDSM('/api-system-v1/stations', {"systemName": data.guardianBroker}) : undefined,
            data.humanBroker ? asyncEDSM('/api-system-v1/stations', {"systemName": data.humanBroker}) : undefined,
            data.IFactor ? asyncEDSM('/api-system-v1/stations', {"systemName": data.IFactor}) : undefined,
            data.fcVendor ? asyncEDSM('/api-system-v1/stations', {"systemName": data.fcVendor}) : undefined,
            data.fcAdmin ? asyncEDSM('/api-system-v1/stations', {"systemName": data.fcAdmin}) : undefined
        ]);

        //make all our system data API calls at once
        let [homeCoords, encodedTraderCoords, manufacturedTraderCoords, rawTraderCoords, guardianBrokerCoords, humanBrokerCoords, IFactorCoords, fcVendorCoords, fcAdminCoords] = await Promise.all([
            data.home ? asyncEDSM('/api-v1/system', {"showCoordinates": 1, "systemName": data.home}) : undefined,
            data.encodedTrader ? asyncEDSM('/api-v1/system', {"showCoordinates": 1, "systemName": data.encodedTrader}) : undefined,
            data.manufacturedTrader ? asyncEDSM('/api-v1/system', {"showCoordinates": 1, "systemName": data.manufacturedTrader}) : undefined,
            data.rawTrader ? asyncEDSM('/api-v1/system', {"showCoordinates": 1, "systemName": data.rawTrader}) : undefined,
            data.guardianBroker ? asyncEDSM('/api-v1/system', {"showCoordinates": 1, "systemName": data.guardianBroker}) : undefined,
            data.humanBroker ? asyncEDSM('/api-v1/system', {"showCoordinates": 1, "systemName": data.humanBroker}) : undefined,
            data.IFactor ? asyncEDSM('/api-v1/system', {"showCoordinates": 1, "systemName": data.IFactor}) : undefined,
            data.fcVendor ? asyncEDSM('/api-v1/system', {"showCoordinates": 1, "systemName": data.fcVendor}) : undefined,
            data.fcAdmin ? asyncEDSM('/api-v1/system', {"showCoordinates": 1, "systemName": data.fcAdmin}) : undefined
        ]);

        tempMessage.edit("System data acquired, verifying things...")

        //require a home system
        if(client.cache[message.guild.id].homeSys === undefined && home === undefined) return tempMessage.edit("...I should've told you, you can't skip the home system")

        // check if given station is actually in system
        if(homeStation !== undefined){
            for(station of home.data.stations){
                if(station.name.toLowerCase() === homeStation.toLowerCase()) {stationExists = true; break}
            }
            if (!stationExists) return tempMessage.edit("Are you sure that station exists in that system?")
        }

        //push the base info to mongo
        await client.serverData.set(`${message.guild.id}.home.homeSys`, `${data.home}`)
        await client.serverData.set(`${message.guild.id}.home.homeStation`, `${homeStation}`)
        client.cache[message.guild.id].homeSys = data.home

        //check if traders exist in given systems and handle accordingly... we need a way to verify trader types too, later
        if(encodedTrader !== undefined){
            let encTrd = checkForStations(encodedTrader, "Material Trader", homeCoords, encodedTraderCoords)
            if (encTrd === false){
                return tempMessage.edit("I can't find a Mat Trader in the encoded trader system you told me about")
            }
            await client.serverData.set(`${message.guild.id}.home.encTrd`, encTrd)
        } else {await client.serverData.set(`${message.guild.id}.home.encTrd`, "")}

        if(manufacturedTrader !== undefined){
            let manfTrd = checkForStations(manufacturedTrader, "Material Trader", homeCoords, manufacturedTraderCoords)
            if (manfTrd === false){
                return tempMessage.edit("I can't find a Mat Trader in the manufactured trader system you told me about")
            }
            await client.serverData.set(`${message.guild.id}.home.manfTrd`, manfTrd)
        } else {await client.serverData.set(`${message.guild.id}.home.manfTrd`, "")}

        if(rawTrader !== undefined){
            let rawTrd = checkForStations(rawTrader, "Material Trader", homeCoords, rawTraderCoords)
            if (rawTrd === false){
                return tempMessage.edit("I can't find a Mat Trader in the raw trader system you told me about")
            }
            await client.serverData.set(`${message.guild.id}.home.rawTrd`, rawTrd)
        } else {await client.serverData.set(`${message.guild.id}.home.rawTrd`, "")}

        if(guardianBroker !== undefined){
            let grdBrk = checkForStations(guardianBroker, "Technology Broker", homeCoords, guardianBrokerCoords)
            if (grdBrk === false){
                return tempMessage.edit("I can't find a Guardian Tech Broker in the system you told me about")
            }
            await client.serverData.set(`${message.guild.id}.home.grdBrk`, grdBrk)
        } else {await client.serverData.set(`${message.guild.id}.home.grdBrk`, "")}

        if(humanBroker !== undefined){
            let hmnBrk = checkForStations(humanBroker, "Technology Broker", homeCoords, humanBrokerCoords)
            if (hmnBrk === false){
                return tempMessage.edit("I can't find a Mat Trader in the encoded trader system you told me about")
            }
            await client.serverData.set(`${message.guild.id}.home.hmnBrk`, hmnBrk)
        } else {await client.serverData.set(`${message.guild.id}.home.hmnBrk`, "")}

        if(IFactor !== undefined){
            let iF = checkForStations(IFactor, "Interstellar Factors Contact", homeCoords, IFactorCoords)
            if (iF === false){
                return tempMessage.edit("I can't find an Interstellar Factor in the system you told me about")
            }
            await client.serverData.set(`${message.guild.id}.home.iF`, iF)
        } else {await client.serverData.set(`${message.guild.id}.home.iF`, "")}

        if(fcVendor !== undefined){
            let fcv = checkForStations(fcVendor, "Tuning", homeCoords, fcVendorCoords)
            if (fcv === false){
                return tempMessage.edit("I can't find an FC Vendor in the system you told me about")
            }
            await client.serverData.set(`${message.guild.id}.home.fcv`, fcv)
        } else {await client.serverData.set(`${message.guild.id}.home.fcv`, "")}

        if(fcAdmin !== undefined){
            let fca = checkForStations(fcAdmin, "Tuning", homeCoords, fcAdminCoords)
            if (fca === false){
                return tempMessage.edit("I can't find an FC Administrator in the system you told me about")
            }
            await client.serverData.set(`${message.guild.id}.home.fca`, fca)
        } else {await client.serverData.set(`${message.guild.id}.home.fca`, "")}

        tempMessage.edit("All Done!")
    }
}