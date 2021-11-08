exports.run = async(client, message, args) => {
    const { Client, MessageEmbed } = require('discord.js');

    let [arg1, arg2] = args.split(" ")

    if(!arg1) return message.channel.send("...what on Earth do you want me to do")

    //anon-setup
    if(arg1 === "anon"){
        // grab the mentioned channel
        let channel = message.mentions.channels.first();
        if (!channel) return message.reply({content:"You silly goose that's not how you do it"});
        let confessChnl = channel.id;

        // save to mongo before confirming it to the user
        const key = `${message.guild.id}`
        await client.serverData.set(`${key}.anonChnl`, confessChnl);

        // confirm it to the user with usage example
        const embed = new MessageEmbed()
            .setColor(0xffd1dc)
            .setDescription(`Anonymous channel set to <#${channel.id}>. DM me a message like this:\n\n ${client.config.prefix} anon ${key} [message]`)
        client.channels.cache.get(confessChnl).send({embeds: [embed]})
    }

    //birthday setup
    else if(arg1 === "bd-config"){
        //set the role
        if (arg2 === "role") {
            if (!message.mentions.roles.first()) return message.channel.send({content:"Please create the role manually and then set it here"});
            await client.serverData.set(`${message.guild.id}.birthdayRole`, message.mentions.roles.first().id)
            message.channel.send({content:"Birthday role set!"})
        //set the channel
        } else if (arg2 === "channel") {
            if (!message.mentions.channels.first().id) return message.reply({content:"You silly goose that's not how you do it"});
            await client.serverData.set(`${message.guild.id}.birthdayChnl`, message.mentions.channels.first().id)
            message.channel.send({content:"Birthday channel set!"})
        }
    }

    //tick listener setup
    else if (arg1 === "bgs"){
        //create metadata
        let channel = message.mentions.channels.first();
        if (!channel) return message.reply({content:"You silly goose that's not how you do it"});
        let bgsChnl = channel.id;
        const key = `${message.guild.id}`

        //push data to mongo
        await client.serverData.set(`${key}.bgsChnl`, bgsChnl);

        //send a confirmation
        const embed = new MessageEmbed()
            .setColor(0xffd1dc)
            .setDescription(`BGS Tick detector set to <#${channel.id}>.`)
        message.channel.send({embeds:[embed]})
    }

    //audit log setup
    else if (arg1 === "logger"){
        //grb channel metadata
        let channel = message.mentions.channels.first();
        if (!channel) return message.reply({content:"You silly goose that's not how you do it"});
        let loggerChnl = channel.id;

        //push data to mongo
        const key = `${message.guild.id}`
        await client.serverData.set(`${key}.logChnl`, loggerChnl);

        //confirm it to the user
        const setChannel = `${client.config.prefix} anon ${key} [message]`
        const embed = new MessageEmbed()
            .setColor(0xffd1dc)
            .setDescription(`Logs channel set to <#${channel.id}>.`)
        message.channel.send({embeds:[embed]})
    }

    //ticket channel setup
    else if (arg1 === "ticket"){        
        let channel = message.mentions.channels.first();
        if (!channel) return message.reply({content:"You silly goose that's not how you do it"});
        let embed = new MessageEmbed()
            .setTitle("Tickets")
            .setDescription("By reacting to this post, a ticket channel will open for you")
           .setColor(0xffd1dc)
        let sent = await channel.send({embeds:[embed]});
        sent.react('🎫');
        await client.serverData.set(`${message.guild.id}.ticket`, sent.id);
        message.channel.send({content:"Ticket system setup done!"})
    }

    //per server prefixes
    else if (arg1 === "prefix"){
        if(!arg2)return message.channel.send("You know I need a prefix to work, right?")
        if(arg2 === client.config.prefix){
            client.prefixes.set(`${message.guild.id}`, "")//update our local cache
            await client.serverData.set(`${message.guild.id}.prefix`, "")//update mongo
            let nick = message.guild.me.displayName.slice(0, message.guild.me.displayName.indexOf("["))
            message.guild.me.setNickname(`${nick}`)
            message.channel.send(`Done! New server prefix is \`${arg2}\``)
        } else {
            client.prefixes.set(`${message.guild.id}`, arg2)//update our local cache
            await client.serverData.set(`${message.guild.id}.prefix`, arg2)//update mongo
            let nick = message.guild.me.displayName.slice(0, message.guild.me.displayName.indexOf("["))
            message.guild.me.setNickname(`${message.guild.me.displayName} [${arg2}]`)
            message.channel.send(`Done! New server prefix is \`${arg2}\``)
        }
    }

    else {message.channel.send("Lord help me D:")}
}

exports.config = {
	guildOnly: true,
	aliases: [],
	permLevel: "serverAdmin",
	name: "setup",
	category: "Management",
	description: "Set up various bot modules",
	usage: ["[anon || bd-config channel || bgs || logger || ticket] [<#channel>]", "bd-config role [<@birthday role>]"]
};