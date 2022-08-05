export const init = (bot: any) => {
    // @ts-expect-error TS(2532): Object is possibly 'undefined'.
    this.levels = bot.managers.get('levels');
    // @ts-expect-error TS(2532): Object is possibly 'undefined'.
    this.autorole = bot.managers.get('autorole');
};

export const run = async (bot: any, msg: any, args: any) => {
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

    // @ts-expect-error TS(2532): Object is possibly 'undefined'.
    const xp = this.levels.xpFromLevel(level - 1);

    // @ts-expect-error TS(2532): Object is possibly 'undefined'.
    await this.levels.setXP(member.id, xp);
    // @ts-expect-error TS(2532): Object is possibly 'undefined'.
    await this.autorole.applyRoles(member);

    msg.channel.send(`:white_check_mark: Set ${member}'s level to ${level}`);

};

export const info = {
    name: 'level',
    usage: 'level <user> <amount>',
    description: 'Sets the rank of a user to a certain level',
    perms: 'MANAGE_GUILD'
};
