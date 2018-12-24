const got = require('got');

exports.run = async (bot, msg) => {
    msg.delete();

    const m = await msg.channel.send(':arrows_counterclockwise:');
    const res = await got('http://aws.random.cat/meow', { json: true });

    if (!res.body || !res.body.file) {
        throw 'Failed to load cat picture!';
    }

    await msg.channel.send({ file: res.body.file });
    m.delete();
};

exports.info = {
    name: 'cat',
    usage: 'cat',
    description: 'Shows a random cat picture'
};
