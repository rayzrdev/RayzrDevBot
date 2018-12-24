exports.init = bot => {
    this.levels = bot.managers.get('levels');
};

exports.run = async (bot, msg, args) => {
    let amount = 10;
    if (!isNaN(args[0])) {
        amount = parseInt(args[0]);
        if (amount < 1) {
            throw `\`${args[0]}\` is an invalid number!`;
        }
    }

    const top = await this.levels.getTop(amount);

    const users = top.map((user, i) => {
        return `**${i + 1}.** <@${user.id}> (Lvl. ${this.levels.levelFromXP(user.xp)})`;
    }).filter(text => !!text);

    const messages = [];
    while (users.length > 25) {
        messages.push(users.splice(0, 25));
    }
    messages.push(users);

    msg.delete();

    messages.forEach(single => {
        msg.channel.send({
            embed: global.factory.embed()
                .setTitle(`Top ${amount} users on **${msg.guild}**`)
                .setDescription(`\u200b\n${single.join('\n\n')}`)
                .setFooter(`Requested by ${msg.author.tag}`)
        }).then(m => m.delete(60000));
    });
};

exports.info = {
    name: 'top',
    usage: 'top',
    description: 'Shows the top-ranked users on the server'
};
