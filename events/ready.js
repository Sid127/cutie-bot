module.exports = {
    name: "ready",
    once: true,
    execute(client) {
        // set activity status
        client.user.setPresence({
            status: 'online',
            activities: [{
                name: "qt help | v6",
                type: "LISTENING"
            }]
        });

        // tell host that bot is online
        console.log(`CUTIE v6 is now online`);
    },
};
