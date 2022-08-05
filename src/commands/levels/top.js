import { clamp } from '../../utils/math';

export const init = bot => {
    this.levels = bot.managers.get('levels');
};

export const run = async (bot, msg, args) => {
    const amount = clamp(
        parseInt(args[0], 10) || 10,
        1,
        100
    );

    const top = await this.levels.getTop(amount);

    if (top.length < 1) {
        throw 'No users have experience yet!';
    }

    const users = top.map((user, i) => {
        return `**${i + 1}.** <@${user.id}> (Lvl. ${this.levels.levelFromXP(user.xp)})`;
    }).filter(text => !!text);

    const messages = [];
    while (users.length > 25) {
        messages.push(users.splice(0, 25));
    }
    messages.push(users);

    const topUser = await bot.users.fetch(top[0].id);
    const thumbnail = topUser.avatarURL();

    messages.forEach(single => {
        msg.channel.send({
            embed: global.factory.embed()
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
