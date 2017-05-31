exports.init = bot => {
    this.levels = bot.managers.get('levels');
};

exports.run = (bot, msg, args) => {
    if (args.length < 2) {
        throw 'Please provide a user and a level';
    }

    const member = msg.mentions.members.first();
    const level = parseInt(args[1]);

    if (isNaN(level)) {
        throw `\`${args[1]}\` is not a valid level.`;
    }

    const xp = this.levels.xpFromLevel(level - 1);
    this.levels.setXP(member.id, xp).then(() => {
        msg.channel.send(`:white_check_mark: Set ${member}'s level to ${level}`);
    });
};

exports.info = {
    name: 'level',
    usage: 'level <user> <amount>',
    description: 'Sets the rank of a user to a certain level',
    perms: 'MANAGE_GUILD'
};