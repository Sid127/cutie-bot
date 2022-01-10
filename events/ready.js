module.exports = {
    name: "ready",
    once: true,
    execute(client) {
        // set activity status
        client.user.setPresence({
            status: 'online',
            activities: [{
                name: "you | qt help | v7",
                type: "WATCHING",
                url: "https://www.youtube.com/watch?v=bxqLsrlakK8"
            }]
        });

        // tell host that bot is online
        console.log(`CUTIE v7 is now online`);
    },
};
