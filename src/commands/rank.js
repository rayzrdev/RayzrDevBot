const RichEmbed = require('discord.js').RichEmbed;

exports.run = async (bot, msg, args) => {
    var user = msg.mentions.users.first() || msg.author;
    var level = await bot.levels.getLevel(user.id);
    var needed = bot.levels.neededXP(level);
    var remaining = await bot.levels.remainingXP(user.id);
    var total = await bot.levels.getXP(user.id);

    msg.channel.sendEmbed(
        new RichEmbed({
            fields: [
                {
                    name: 'Level',
                    value: level
                },
                {
                    name: 'Next Level',
                    value: `${remaining.toFixed(0)}/${needed.toFixed(0)}`
                },
                {
                    name: 'Total XP',
                    value: total.toFixed(0)
                }
            ]
        })
            .setAuthor(user.username, user.avatarURL)
            .setColor(bot.config.color)
    );
}

exports.info = {
    name: 'rank',
    usage: 'rank [user]',
    description: 'Shows you your rank'
}