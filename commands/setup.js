exports.run = async(client, message, args) => {
    const { Client, MessageEmbed, Formatters } = require('discord.js');
    const { asyncEDSM } = require("../functionFiles/APICalls.js");
    const { checkForStations } = require('../functionFiles/helperFunctions');

    if(!args) return message.channel.send("...what on Earth do you want me to do")

    let [arg1, ...arg2] = args.split(" ")
    let key = `${message.guild.id}`

    switch (arg1) {
        case 'anon' : { //anon-setup
            // grab the mentioned channel
            let channel = message.mentions.channels.first();
            if (!channel) return message.reply({content:"You silly goose that's not how you do it"});
            let confessChnl = channel.id;

            // save to mongo before confirming it to the user
            await client.serverData.set(`${key}.anonChnl`, confessChnl);

            // confirm it to the user with usage example
            let embed = new MessageEmbed()
                .setColor(0xffd1dc)
                .setDescription(`Anonymous channel set to <#${channel.id}>. DM me a message like this:\n\n ${client.config.prefix} anon ${key} [message]`)
            client.channels.cache.get(confessChnl).send({embeds: [embed]})
        } break;
        case 'bd-config' : {//birthday setup
            //set the role
            if (arg2[0] === "role") {
                if (!message.mentions.roles.first()) return message.channel.send({content:"Please create the role manually and then set it here"});
                await client.serverData.set(`${message.guild.id}.birthdayRole`, message.mentions.roles.first().id)
                message.channel.send({content:"Birthday role set!"})
            //set the channel
            } else if (arg2[0] === "channel") {
                if (!message.mentions.channels.first().id) return message.reply({content:"You silly goose that's not how you do it"});
                await client.serverData.set(`${message.guild.id}.birthdayChnl`, message.mentions.channels.first().id)
                message.channel.send({content:"Birthday channel set!"})
            }
        } break;
        case 'bgs' : {//tick listener setup
            //create metadata
            let channel = message.mentions.channels.first();
            if (!channel) return message.reply({content:"You silly goose that's not how you do it"});
            let bgsChnl = channel.id;

            //push data to mongo
            await client.serverData.set(`${key}.bgsChnl`, bgsChnl);

            //send a confirmation
            let embed = new MessageEmbed()
                .setColor(0xffd1dc)
                .setDescription(`BGS Tick detector set to <#${chnll.id}>.`)
            message.channel.send({embeds:[embed]})
        } break;
        case 'logger' : {//audit log setup
            //grb channel metadata
            let channel = message.mentions.channels.first();
            if (!channel) return message.reply({content:"You silly goose that's not how you do it"});
            let loggerChnl = channel.id;

            //push data to mongo
            await client.serverData.set(`${key}.logChnl`, loggerChnl);

            //confirm it to the user
            let embed = new MessageEmbed()
                .setColor(0xffd1dc)
                .setDescription(`Logs channel set to <#${channel.id}>.`)
            message.channel.send({embeds:[embed]})
        } break;
        case 'ticket' : {//ticket channel setup
            let channel = message.mentions.channels.first();
            if (!channel) return message.reply({content:"You silly goose that's not how you do it"});
            let Mbed = new MessageEmbed()
                .setTitle("Tickets")
                .setDescription("By reacting to this post, a ticket channel will open for you")
            .setColor(0xffd1dc)
            let sent = await channel.send({embeds:[Mbed]});
            sent.react('🎫');
            await client.serverData.set(`${message.guild.id}.ticket`, sent.id);
            message.channel.send({content:"Ticket system setup done!"})
        } break;
        case 'prefix' : {//per server prefixes
            if(!arg2[0])return message.channel.send("You know I need a prefix to work, right?")
            if(arg2[0] === client.config.prefix){
                client.cache[message.guild.id].prefix = "" //update our local cache
                await client.serverData.set(`${message.guild.id}.prefix`, "")//update mongo
                let nick = message.guild.me.displayName.slice(0, message.guild.me.displayName.indexOf("["))
                message.guild.me.setNickname(`${nick}`)
                message.channel.send(`Done! New server prefix is \`${arg2[0]}\``)
            } else {
                client.cache[message.guild.id].prefix = arg2[0] //update our local cache
                await client.serverData.set(`${message.guild.id}.prefix`, arg2[0])//update mongo
                let nick = message.guild.me.displayName.slice(0, message.guild.me.displayName.indexOf("["))
                message.guild.me.setNickname(`${message.guild.me.displayName} [${arg2[0]}]`)
                message.channel.send(`Done! New server prefix is \`${arg2[0]}\``)
            }
        } break;
        case 'activitypoints' : {//activity based leaderboards
            if(arg2[0] === "disabled"){
                client.cache[message.guild.id].activityLeaderboard = arg2[0]//update our local cache
                await client.serverData.set(`${message.guild.id}.activityLeaderboard`, arg2[0])//update mongo
                message.channel.send("Activity based points system disabled")
            } else if (arg2[0] === "enabled"){
                client.cache[message.guild.id].activityLeaderboard = arg2[0]//update our local cache
                await client.serverData.set(`${message.guild.id}.activityLeaderboard`, arg2[0])//update mongo
                message.channel.send("Activity based points system enabled")
            }
        } break;
        case 'home' : {//home system setup
            if(arg2[0] === "template" || !arg2[0]){ // give a way to provide the template
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

                if(arg2.join(" ").match("(<|>|system|name|nearest)")) return tempMessage.edit("I TOLD you to remove the text hints >:(")
                let data = JSON.parse(arg2.join(" ").replace(/(\r\n|\n|\r|\t)/gm, "")) // create json

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
        } break;
        default : message.channel.send("Lord help me D:")
    }
}

exports.config = {
	guildOnly: true,
	aliases: [],
	permLevel: "serverAdmin",
	name: "setup",
	category: "Management",
	description: "Set up various bot modules",
	usage: ["[anon || bd-config channel || bgs || logger || ticket] [<#channel>]", "bd-config role [<@birthday role>]", "prefix [<prefix>]", "activitypoints [enabled || disabled]", "home"]
};