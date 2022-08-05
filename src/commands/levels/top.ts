// @ts-expect-error TS(2614): Module '"../../utils/math"' has no exported member... Remove this comment to see the full error message
import { clamp } from '../../utils/math';

export const init = (bot: any) => {
    // @ts-expect-error TS(2532): Object is possibly 'undefined'.
    this.levels = bot.managers.get('levels');
};

export const run = async (bot: any, msg: any, args: any) => {
    const amount = clamp(
        parseInt(args[0], 10) || 10,
        1,
        100
    );

    // @ts-expect-error TS(2532): Object is possibly 'undefined'.
    const top = await this.levels.getTop(amount);

    if (top.length < 1) {
        throw 'No users have experience yet!';
    }

    const users = top.map((user: any, i: any) => {
        // @ts-expect-error TS(2532): Object is possibly 'undefined'.
        return `**${i + 1}.** <@${user.id}> (Lvl. ${this.levels.levelFromXP(user.xp)})`;
    }).filter((text: any) => !!text);

    const messages = [];
    while (users.length > 25) {
        messages.push(users.splice(0, 25));
    }
    messages.push(users);

    const topUser = await bot.users.fetch(top[0].id);
    const thumbnail = topUser.avatarURL();

    messages.forEach(single => {
        msg.channel.send({
    embed: (global as any).factory.embed()
        .setTitle(`Top ${amount} users on **${msg.guild}**`)
        .setDescription(`\u200b\n${single.join('\n\n')}\n\u200b`)
        .setFooter(`Requested by ${msg.author.tag}`)
        .setThumbnail(thumbnail)
});
    });
};

export const info = {
    name: 'top',
    usage: 'top',
    description: 'Shows the top-ranked users on the server'
};
