export const init = bot => {
    this.levels = bot.managers.get('levels');
    this.autorole = bot.managers.get('autorole');
};

export const run = async (bot, msg, args) => {
    if (args.length < 2) {
        throw 'Please provide a user and a level';
    }

    const member = msg.mentions.members.first();

    if (!member) {
        throw 'Please mention a member to set the level of!';
    }

    const level = parseInt(args[1]);

    if (isNaN(level)) {
        throw `\`${args[1]}\` is not a valid level.`;
    }

    const xp = this.levels.xpFromLevel(level - 1);

    await this.levels.setXP(member.id, xp);
    await this.autorole.applyRoles(member);

    msg.channel.send(`:white_check_mark: Set ${member}'s level to ${level}`);

};

export const info = {
    name: 'level',
    usage: 'level <user> <amount>',
    description: 'Sets the rank of a user to a certain level',
    perms: 'MANAGE_GUILD'
};
