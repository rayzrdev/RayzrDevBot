export const init = (bot: any) => {
    // @ts-expect-error TS(2532): Object is possibly 'undefined'.
    this.levels = bot.managers.get('levels');
};

export const run = (bot: any, msg: any, args: any) => {
    if (args.length < 2) {
        throw 'Please provide a user and an XP amount';
    }

    const member = msg.mentions.members.first();

    if (!member) {
        throw 'Please mention the member to set the XP of!';
    }

    const xp = parseInt(args[1]);

    if (isNaN(xp)) {
        throw `\`${args[1]}\` is not a valid XP amount.`;
    }

    // @ts-expect-error TS(2532): Object is possibly 'undefined'.
    this.levels.setXP(member.id, xp).then(() => {
        msg.channel.send(`:white_check_mark: Set ${member}'s XP to ${xp}`);
    });
};

export const info = {
    name: 'xp',
    usage: 'xp <user> <amount>',
    description: 'Sets the rank of a user to a certain XP amount',
    perms: 'MANAGE_GUILD'
};
