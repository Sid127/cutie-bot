exports.run = (client, message, args) => {

    const mmbr = message.guild.members.cache.get(message.author.id);
    if (mmbr === client.user) return message.channel.send("Not messing with my own color");

    let clr = args;
    if (clr.startsWith('#')) clr = clr.substr(1);
    if (clr.length > 6) return message.channel.send("Hex codes only have 6 characters in them >:(")
    if (clr === 'random') {
        clr = Math.floor(Math.random() * (0xFFFFFF + 1));
    } else if (isNaN(parseInt(clr, 16)))
        return message.channel.send("Please check your hex code again. Valid hex codes only have digits 0-9 and alphabets a-f");

    // change the color of the existing col role
    if (mmbr.roles.cache.find(a => a.name.endsWith(' col'))) {
        mmbr.roles.cache.find(a => a.name.endsWith(' col')).edit({
            name: clr + ' col',
            color: clr,
        }).catch(console.error);
        message.channel.send(`${mmbr.displayName}, color changed!`);
    }
    // create and assign a role
    else {
        message.guild.roles.create({
            name: clr + ' col',
            color: clr,
            mentionable: false,
            position: message.guild.members.me.roles.highest.position - 5,
            permissions: mmbr.permissions
        }).then(function(role) {
            mmbr.roles.add(role);
            message.channel.send(`${mmbr.displayName}, color assigned!`);
        }).catch(console.error);
    }
}

exports.config = {
    enabled: true,
    guildOnly: true,
    aliases: ["colourme"],
    permLevel: "User",
    name: "colorme",
    description: "Set your color with a hex code",
    usage: ["[<hex code>]"]
};
