const RichEmbed = require('discord.js').RichEmbed;

exports.run = async (bot, msg, args) => {
    let amount = 10;
    if (!isNaN(args[0])) {
        amount = parseInt(args[0]);
        if (amount < 1) {
            throw `\`${args[0]}\` is an invalid number!`;
        }
    }

    const top = await bot.levels.getTop(amount);

    const users = top.map((e, i) => {
        return `**${i + 1}.** <@${e.key}> (Lvl. ${bot.levels.levelFromXP(e.value)})`;
    }).filter(text => !!text);

    const messages = [];
    while (users.length > 50) {
        messages.push(users.splice(0, 50));
    }
    messages.push(users);

    msg.delete();

    messages.forEach(single => {
        msg.channel.send({
            embed: new RichEmbed()
                .setTitle(`Top ${amount} users on **${msg.guild}**`)
                .setDescription(`\u200b\n${single.join('\n\n')}`)
                .setFooter(`Requested by ${msg.author.tag}`)
                .setColor(bot.config.color)
        });
    });
};

exports.info = {
    name: 'top',
    usage: 'top',
    description: 'Shows the top-ranked users on the server'
};