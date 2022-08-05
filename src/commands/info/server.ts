// @ts-expect-error TS(7016): Could not find a declaration file for module 'comm... Remove this comment to see the full error message
import { stripIndents } from 'common-tags';
// @ts-expect-error TS(7016): Could not find a declaration file for module '@ray... Remove this comment to see the full error message
import pinger from '@rayzr/minecraft-pinger';

const ping = async (host: any, port: any) => {
    return new Promise((resolve, reject) => {
        try {
            pinger.ping(host, port, (err: any, result: any) => {
                if (err) return reject(err);
                else resolve(result);
            });
        } catch (e) {
            reject(e);
        }
    });
};

export const run = async (bot: any, msg: any, args: any) => {
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
    embed: (global as any).factory.embed()
        .setTitle(`:white_check_mark: **${args[0]}**`)
        .setDescription(stripIndents `
                **Ping:** \`${(result as any).ping}ms\`
                **Players:** \`${(result as any).players.online}/${(result as any).players.max}\`
                **Version:** \`${(result as any).version.name}\`
                **Motd:**\`\`\`\n${((result as any).description.text || (result as any).description).replace(/\u00a7[0-9a-fklmnor]/g, '')}\n\`\`\``)
        .setFooter(`Requested by ${msg.author.tag}`)
});
};

export const info = {
    name: 'server',
    usage: 'server <ip[:port]>',
    description: 'Pings a Minecraft server'
};
