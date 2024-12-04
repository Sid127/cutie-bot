module.exports = {
    name: "ready",
    once: true,
    execute(client) {
        // set activity status
        client.user.setPresence({
            status: 'online',
            activities: [{
                name: "you | qt help",
                type: 3,
                url: "https://www.youtube.com/watch?v=yKQ_sQKBASM"
            }]
        });

        // tell host that bot is online
        console.log(`CUTIE is now online`);
    },
};
