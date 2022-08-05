export const run = async (bot: any, msg: any) => {
    await msg.channel.send(':arrows_counterclockwise: | Restarting...');
    process.exit(1);
};

export const info = {
    name: 'restart',
    description: 'Restarts the bot',
    ownerOnly: true
};
