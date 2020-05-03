const stripIndents = require('common-tags').stripIndents;

const pinger = require('@rayzr/minecraft-pinger');

const ping = async (host, port) => {
    return new Promise((resolve, reject) => {
        try {
            pinger.ping(host, port, (err, result) => {
                if (err) return reject(err);
                else resolve(result);
            });
        } catch (e) {
            reject(e);
        }
    });
};

exports.run = async (bot, msg, args) => {
    if (args.length < 1) {
        throw 'You must enter a server IP!';
    }

    const host = args[0].split(':')[0];
    const port = args[0].split(':')[1] || '25565';

    msg.delete();
    const m = await msg.channel.send(':arrows_counterclockwise:');

    const result = await ping(host, port);

    m.edit({
        content: '',
        embed: global.factory.embed()
            .setTitle(`:white_check_mark: **${args[0]}**`)
            .setDescription(stripIndents`
                **Ping:** \`${result.ping}ms\`
                **Players:** \`${result.players.online}/${result.players.max}\`
                **Version:** \`${result.version.name}\`
                **Motd:**\`\`\`\n${(result.description.text || result.description).replace(/\u00a7[0-9a-fklmnor]/g, '')}\n\`\`\``)
            .setFooter(`Requested by ${msg.author.tag}`)
    });
};

exports.info = {
    name: 'server',
    usage: 'server <ip[:port]>',
    description: 'Pings a Minecraft server'
};
