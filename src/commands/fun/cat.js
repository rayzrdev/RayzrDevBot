const got = require('got');

exports.run = async (bot, msg) => {
    msg.delete();

    const m = await msg.channel.send(':arrows_counterclockwise:');
    const { file } = await got('http://aws.random.cat/meow').json();

    if (!file) {
        throw 'Failed to load cat picture!';
    }

    await msg.channel.send({ files: [file] });
    m.delete();
};

exports.info = {
    name: 'cat',
    usage: 'cat',
    description: 'Shows a random cat picture'
};
