exports.init = bot => {
    this.levels = bot.managers.get('levels');
};

exports.run = (bot, msg, args) => {
    if (args.length < 2) {
        throw 'Please provide a user and an XP amount';
    }

    const member = msg.mentions.members.first();
    const xp = parseInt(args[1]);

    if (isNaN(xp)) {
        throw `\`${args[1]}\` is not a valid XP amount.`;
    }

    this.levels.setXP(member.id, xp).then(() => {
        msg.channel.send(`:white_check_mark: Set ${member}'s XP to ${xp}`);
    });
};

exports.info = {
    name: 'xp',
    usage: 'xp <user> <amount>',
    description: 'Sets the rank of a user to a certain XP amount',
    perms: 'MANAGE_GUILD'
};
