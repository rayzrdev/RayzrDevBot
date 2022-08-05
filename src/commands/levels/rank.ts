export const run = async (bot: any, message: any, args: any) => {
    const target = message.mentions.users.first() || bot.users.cache.get(args[0]) || message.author;

    const data = await bot.managers.get('levels').getUserData(target.id);

    message.channel.send({
    embed: (global as any).factory.embed()
        .addField('Rank', `${data.rank.place || data.rank.total}/${data.rank.total}`, true)
        .addField('Level', data.currentLevel, true)
        .addField('Next Level', `${data.remaining.toFixed(0)}/${data.xpToLevel.toFixed(0)}`, true)
        .addField('Total XP', data.total.toFixed(0), true)
        .setAuthor(target.username, target.avatarURL())
        .setThumbnail(target.avatarURL())
        .setFooter(`Requested by ${message.author.tag}`)
});
};

export const info = {
    name: 'rank',
    usage: 'rank [user]',
    description: 'Shows you your rank'
};
