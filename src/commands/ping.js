exports.run = async (bot, msg) => {
    var m = await msg.channel.sendMessage('Pong!');
    m.edit(`Pong! \`${m.createdTimestamp - msg.createdTimestamp}ms\` :watch:`);
};

exports.info = {
    name: 'ping',
    usage: 'ping',
    description: 'Pings the bot'
};