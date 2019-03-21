exports.run = async (bot, message, args) => {
    const userRoles = (global.config.userRoles || [])
        .map(item => message.guild.roles.get(item))
        .filter(item => !!item);

    let roleName = args.join(' ');
    if (!roleName) {
        return message.channel.send(`:information_source: Available roles:\n\n${userRoles.map(role => `- **${role.name}**`).join('\n')}`);
    }

    const selectedRole = userRoles.find(role => role.name.toLowerCase() === roleName.toLowerCase());

    if (!selectedRole) {
        throw 'That is not an available self-assignable role.';
    }

    let hadRole = message.member.roles.has(selectedRole.id);

    try {
        if (hadRole) {
            await message.member.removeRole(selectedRole);
        } else {
            await message.member.addRole(selectedRole);
        }
    } catch (error) {
        throw 'I could not add or remove that role to you! Please contact a staff member to have them correct this issue.';
    }

    if (hadRole) {
        message.channel.send(`:white_check_mark: Removed the role \`${selectedRole.name}\` from you.`);
    } else {
        message.channel.send(`:white_check_mark: Gave you the role \`${selectedRole.name}\`.`);
    }
};

exports.info = {
    name: 'role',
    usage: 'role [name]',
    description: 'Lets you assign or unassign yourself roles.'
};
