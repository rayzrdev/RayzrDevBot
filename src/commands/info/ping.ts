export const run = async (bot: any, msg: any) => {
    const m = await msg.channel.send('Pong!');
    m.edit(`Pong! \`${m.createdTimestamp - msg.createdTimestamp}ms\` :watch:`);
};

export const info = {
    name: 'ping',
    usage: 'ping',
    description: 'Pings the bot'
};
