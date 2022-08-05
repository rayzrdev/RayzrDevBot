import cool from 'cool-ascii-faces';

export const run = (_bot, msg) => {
    msg.delete();
    msg.channel.send(cool());
};

export const info = {
    name: 'face',
    usage: 'face',
    description: 'Shows a random ASCII face'
};
