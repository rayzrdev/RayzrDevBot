const RichEmbed = require('discord.js').RichEmbed;

const mc = require('minecraft-protocol');
const embedFixer = ' '.repeat(51);

exports.run = (bot, msg, args) => {
    if (args.length < 1) {
        msg.channel.sendMessage(':no_entry_sign: You must enter a server IP!');
        return;
    }

    let host = args[0].split(':')[0];
    let port = args[0].split(':')[1] || '25565';

    msg.channel.sendMessage(':arrows_counterclockwise: Pinging...').then(m => {
        mc.ping({ host, port }, (err, res) => {
            if (err) {
                var message = 'Something went wrong!';

                if (err.code === 'ENOTFOUND') message = 'That is not a valid server address!';
                else if (err.code === 'ETIMEDOUT') message = 'Timed out.';
                else if (err.code === 'ECONNREFUSED') message = 'That server is offline.';

                m.edit('', { embed: new RichEmbed().setTitle(`:x: ${args[0]}`).setDescription(message).setColor(bot.config.color) });
            } else {
                if (res.description.extra) {
                    res.description.text = res.description.extra.map(i => i.text).join('');
                }
                m.edit('', {
                    embed: new RichEmbed()
                        .setTitle(`:white_check_mark: **${args[0]}**`)
                        .setDescription(`
**Ping:** \`${res.latency}ms\`
**Players:** \`${res.players.online}/${res.players.max}\`
**Version:** \`${res.version.name}\`
**Motd:**\`\`\`${embedFixer}\n${(res.description.text || res.description).replace(/\u00a7[0-9a-fklmnor]/g, '')}\n${embedFixer}\`\`\`
`)
                        .setColor(bot.config.color)
                });
            }
        });
    });
};

exports.info = {
    name: 'server',
    usage: 'server <ip[:port]>',
    description: 'Pings a Minecraft server'
};