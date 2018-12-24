exports.run = async (bot, msg, args) => {
    let user;
    if (msg.mentions.users.first()) {
        user = msg.mentions.users.first();
    } else if (args.length === 1) {
        user = bot.users.get(args[0]);
    }

    if (!user) {
        user = msg.author;
    }

    const data = await bot.managers.get('levels').getUserData(user.id);

    msg.delete();
    msg.channel.send({
        embed: global.factory.embed()
            .addField('Rank', `${data.rank.place || data.rank.total}/${data.rank.total}`)
            .addField('Level', data.currentLevel)
            .addField('Next Level', `${data.remaining.toFixed(0)}/${data.xpToLevel.toFixed(0)}`)
            .addField('Total XP', data.total.toFixed(0))
            .setAuthor(user.username, user.avatarURL)
            .setFooter(`Requested by ${msg.author.tag}`)
    }).then(m => m.delete(30000));
};

exports.info = {
    name: 'rank',
    usage: 'rank [user]',
    description: 'Shows you your rank'
};
