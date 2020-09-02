exports.run = (client, message, args) => {
  const { canModifyQueue } = require("../util/CutieUtil");
  const queue = message.client.queue.get(message.guild.id);
  if (!queue) return message.channel.send("There is no queue.").catch(console.error);
  if (!canModifyQueue(message.member)) return;

  if (!args.length) return message.channel.send(`Usage: ${message.client.prefix}remove <Queue Number>`);
  if (isNaN(args[0])) return message.channel.send(`Usage: ${message.client.prefix}remove <Queue Number>`);

  const song = queue.songs.splice(args[0] - 1, 1);
  queue.textChannel.send(`${message.author.username} removed **${song[0].title}** from the queue.`);
}