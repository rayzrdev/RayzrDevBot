const RichEmbed = require('discord.js').RichEmbed;

exports.run = async (bot, msg) => {
    const user = msg.mentions.users.first() || msg.author;

    const data = await bot.managers.get('levels').getUserData(user.id);

    msg.delete();
    msg.channel.send({
        embed: new RichEmbed()
            .addField('Rank', `${data.rank.place || data.rank.total}/${data.rank.total}`)
            .addField('Level', data.currentLevel)
            .addField('Next Level', `${data.remaining.toFixed(0)}/${data.xpToLevel.toFixed(0)}`)
            .addField('Total XP', data.total.toFixed(0))
            .setAuthor(user.username, user.avatarURL)
            .setFooter(`Requested by ${msg.author.tag}`)
            .setColor(global.config.color)
    }).then(m => m.delete(30000));
};

exports.info = {
    name: 'rank',
    usage: 'rank [user]',
    description: 'Shows you your rank'
};