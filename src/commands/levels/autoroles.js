exports.init = bot => {
    this.autorole = bot.managers.get('autorole');
};

exports.run = async (bot, msg, args) => {
    const roles = await this.autorole.getRoles(msg.guild.id);

    if (args.length < 1) {
        if (Object.keys(roles).length < 1) {
            throw 'No auto-roles have been set up yet.';
        }

        let message = '__**ROLES**__\n\n';

        Object.keys(roles).forEach(level => {
            const role = msg.guild.roles.get(roles[level]) || { name: '~~INVALID-ROLE~~' };
            message += `:arrow_right: ${role.name}\n:white_small_square: Given at level ${level}\n\n`;
        });

        return msg.channel.send(message);
    }

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
        const role = msg.guild.roles.find(role => role.name.toLowerCase() === roleName.toLowerCase());
        if (!role) {
            throw `The role \`${roleName}\` could not be found.`;
        }

        await this.autorole.addRole(role, level);
        msg.channel.send(`Added role \`${role.name}\` at level ${level}. :ok_hand:`).then(m => m.delete(5000));

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

        if (!roles[level]) {
            throw `There are no roles set for level ${level}.`;
        }

        const result = await this.autorole.removeRole(msg.guild, level);
        if (!result) {
            throw `Failed to remove any roles for level ${level}.`;
        }

        msg.channel.send(`Removed auto-roles for level ${level}`);
    } else {
        msg.channel.send('Please check the help message for this command for information on how to use it!');
    }
};

exports.info = {
    name: 'autoroles',
    usage: 'autoroles [add|remove]',
    aliases: ['roles'],
    description: 'Shows or modifies the auto-role settings.'
};