const RichEmbed = require('discord.js').RichEmbed;
const oneLine = require('common-tags').oneLine;

exports.run = async (bot, msg, args) => {
    try {
        var amount = 10;
        if (!isNaN(args[0])) {
            amount = parseInt(args[0]);
            if (amount < 1) {
                msg.channel.sendMessage(`:no_entry_sign: \`${args[0]}\` is an invalid number!`);
                return;
            }
        }

        var top = await bot.levels.getTop(amount);

        var users = top.map((e, i) => {
            return `**${i + 1}.** <@${e.key}> (Lvl. ${bot.levels.levelFromXP(e.value)})`;
        }).filter(text => !!text);

        var messages = [];
        while (users.length > 50) {
            messages.push(users.splice(0, 50));
        }
        messages.push(users);

        messages.forEach(single => {
            msg.channel.sendEmbed(
                new RichEmbed()
                    .setTitle(`Top ${amount} users on **${msg.guild}**`)
                    .setDescription(`\u200b\n${single.join('\n\n')}`)
                    .setColor(bot.config.color)
            );
        });
    } catch (err) {
        msg.guild.owner.sendMessage(err);
    }
};

exports.info = {
    name: 'top',
    usage: 'top',
    description: 'Shows the top-ranked users on the server'
};