const RichEmbed = require('discord.js').RichEmbed;

exports.run = async (bot, msg, args) => {
    try {
        var user = msg.mentions.users.first() || msg.author;

        var data = await bot.levels.getUserData(user.id);

        msg.channel.sendEmbed(
            new RichEmbed({
                fields: [
                    {
                        name: 'Rank',
                        value: `${data.rank.place || data.rank.total}/${data.rank.total}`
                    },
                    {
                        name: 'Level',
                        value: data.currentLevel
                    },
                    {
                        name: 'Next Level',
                        value: `${data.remaining.toFixed(0)}/${data.xpToLevel.toFixed(0)}`
                    },
                    {
                        name: 'Total XP',
                        value: data.total.toFixed(0)
                    }
                ]
            })
                .setAuthor(user.username, user.avatarURL)
                .setColor(bot.config.color)
        );
    } catch (err) {
        msg.guild.owner.sendMessage(err);
    }
}

exports.info = {
    name: 'rank',
    usage: 'rank [user]',
    description: 'Shows you your rank'
}