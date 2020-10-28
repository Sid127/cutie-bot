exports.run = (client, message, [srvr, ...confession]) => {
  if(message.channel.type === 'dm') {
    const { Client, MessageEmbed } = require('discord.js');
    const moment = require("moment-timezone");
    actionDate = moment(message.createdTimestamp).format('hh:mm DD/MM/YYYY')

    const embed = new MessageEmbed()
      .setColor(0xffd1dc)
      .setDescription(`${confession.join(" ")}`)
      .setFooter(`${actionDate}`)

  	if (!client.confess.has(srvr)) return;
    if (client.confess.get(srvr, "anonChnl") === null) return;
    const sendSrvr = client.confess.get(srvr, "guild")
    const sendChnl = client.confess.get(srvr, "anonChnl")

    if (srvr === sendSrvr){
      client.channels.cache.get(sendChnl).send(embed).catch(console.error);
    }
  } else {}
}
