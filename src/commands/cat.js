const request = require('request');

function get(url) {
    return new Promise((resolve, reject) => {
        request(url, (err, res, body) => {
            err ? reject(err) : resolve(body);
        });
    });
}

exports.run = async (bot, msg, args) => {
    msg.delete();

    var m = await msg.channel.sendMessage(':arrows_counterclockwise:');

    try {
        var res = JSON.parse(await get('http://random.cat/meow'));
        await msg.channel.sendFile(res.file);
        m.delete();
    } catch (err) {
        m.channel.sendMessage(`:no_entry_sign: ${err}`);
    }
};

exports.info = {
    name: 'cat',
    usage: 'cat',
    description: 'Shows a random cat picture'
};