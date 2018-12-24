exports.run = async (bot, msg) => {
    await msg.channel.send(':arrows_counterclockwise: | Restarting...');
    process.exit(1);
};

exports.info = {
    name: 'restart',
    description: 'Restarts the bot',
    ownerOnly: true
};
