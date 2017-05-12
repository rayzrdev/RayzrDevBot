const got = require('got');

exports.run = async (bot, msg) => {
    msg.delete();

    const m = await msg.channel.send(':arrows_counterclockwise:');
    const res = await got('http://random.cat/meow');

    if (!JSON.isJSON(res.body)) {
        throw 'Failed to load cat picture!';
    }

    await msg.channel.send({ file: JSON.parse(res.body).file });
    m.delete();
};

exports.info = {
    name: 'cat',
    usage: 'cat',
    description: 'Shows a random cat picture'
};