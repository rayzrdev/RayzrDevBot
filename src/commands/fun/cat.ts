import got from 'got';

export const run = async (bot: any, msg: any) => {
    msg.delete();

    const m = await msg.channel.send(':arrows_counterclockwise:');
    const { file } = await got('http://aws.random.cat/meow').json();

    if (!file) {
        throw 'Failed to load cat picture!';
    }

    await msg.channel.send({ files: [file] });
    m.delete();
};

export const info = {
    name: 'cat',
    usage: 'cat',
    description: 'Shows a random cat picture'
};
