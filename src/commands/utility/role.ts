export const run = async (bot: any, message: any, args: any) => {
    const userRoles = ((global as any).config.userRoles || [])
    .map((item: any) => message.guild.roles.cache.get(item))
    .filter((item: any) => !!item);

    let roleName = args.join(' ');
    if (!roleName) {
        return message.channel.send(`:information_source: Available roles:\n\n${userRoles.map((role: any) => `- **${role.name}**`).join('\n')}`);
    }

    const selectedRole = userRoles.find((role: any) => role.name.toLowerCase() === roleName.toLowerCase());

    if (!selectedRole) {
        throw 'That is not an available self-assignable role.';
    }

    let hadRole = message.member.roles.cache.has(selectedRole.id);

    try {
        if (hadRole) {
            await message.member.roles.remove(selectedRole);
        } else {
            await message.member.roles.add(selectedRole);
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

export const info = {
    name: 'role',
    usage: 'role [name]',
    description: 'Lets you assign or unassign yourself roles.'
};
