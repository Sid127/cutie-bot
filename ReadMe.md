# Cutie - a general purpose Discord bot

Feel free to fork the repo and modify code according to your requirements.

# How to host

- Install node.js v16.x
- Clone this repo and move to the cloned directory
- Place your "config.json" file in the base/cloned directory. Your Config file MUST be of this format:

```
{
    "token": "<yourToken>",
    "prefix": "<yourPrefix>",
    "mongoURL": "<mongoAuthUrl"
}
```

- Run the following command

```
npm ci
```

- Run this final command to get the bot online

```
node index.js
```

Cutie has an ever expanding feature set, but the current modules include:
- Birthdays
- Color roles (like Hex)
- Confessions (like Juzo)
- Custom Commands
- Moderation Commands
- A points system that can be changed from activity based to reward based.
- Support commands to assist with self-help
- Elite Dangerous companion commands
- An Elite Dangerous tick listener
- Autorole on member join
- Custom welcome message
- Per server prefixes
- Ticket channels
- Reaction Roles
