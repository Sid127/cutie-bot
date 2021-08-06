module.exports = {
    name: "ready",
    once: true,
    execute(client) {
        // set activity status
        client.user.setPresence({
            status: 'online',
            activities: [{
                name: "qt help | v5",
                type: "LISTENING"
            }]
        });

        // tell host that bot is online
        console.log(`CUTIE v5 is now online`);
    },
};
