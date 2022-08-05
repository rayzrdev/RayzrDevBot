export const init = (bot: any) => {
    // @ts-expect-error TS(2532): Object is possibly 'undefined'.
    this.autorole = bot.managers.get('autorole');
    // @ts-expect-error TS(2532): Object is possibly 'undefined'.
    this.levels = bot.managers.get('levels');
};

export const run = async (bot: any, msg: any, args: any) => {
    msg.delete();

    if (/add/i.test(args[0])) {
        if (args.length < 2) {
            throw 'You must provide a level and a role (in that order).';
        }

        if (isNaN(args[1])) {
            throw `\`${args[1]}\` must be a number!`;
        }

        const level = Math.round(parseInt(args[1]));
        if (level < 1) {
            throw 'The level must be at least 1!';
        }

        const roleName = args.slice(2).join(' ');
        const role = msg.guild.roles.find((role: any) => role.name.toLowerCase() === roleName.toLowerCase());
        if (!role) {
            throw `The role \`${roleName}\` could not be found.`;
        }

        // @ts-expect-error TS(2532): Object is possibly 'undefined'.
        await this.autorole.addRole(role, level);
        msg.channel.send(`Added role \`${role.name}\` at level ${level}. :ok_hand:`).then((m: any) => m.delete({timeout: 5000}));

    } else if (/remove/i.test(args[0])) {
        if (args.length < 1) {
            throw 'You must provide a level!';
        }

        if (isNaN(args[1])) {
            throw `\`${args[1]}\` must be a number!`;
        }

        const level = Math.round(parseInt(args[1]));
        if (level < 1) {
            throw 'The level must be at least 1!';
        }


        // @ts-expect-error TS(2532): Object is possibly 'undefined'.
        const roles = await this.autorole.getRoles(msg.guild.id);

        if (!roles[level]) {
            throw `There are no roles set for level ${level}.`;
        }

        // @ts-expect-error TS(2532): Object is possibly 'undefined'.
        const result = await this.autorole.removeRole(msg.guild, level);
        if (!result) {
            throw `Failed to remove any roles for level ${level}.`;
        }

        msg.channel.send(`Removed auto-roles for level ${level}`);
    } else if (/retro/i.test(args[0])) {
        const members = await msg.guild.members.fetch();

        // @ts-expect-error TS(2532): Object is possibly 'undefined'.
        const results = await Promise.all(members.map((member: any) => this.autorole.applyRoles(member)));
        const updated = results.filter(result => result).length;

        msg.channel.send(`:white_check_mark: Updated \`${updated}/${members.size}\` users.`);
    } else {
        throw 'help';
    }
};

export const info = {
    name: 'autoroles',
    usage: 'autoroles add <level> <role>|remove <level>|retro',
    aliases: ['autorole'],
    description: 'Modifies the auto-role settings.',
    perms: ['MANAGE_GUILD']
};
