export const run = (_bot, message, args) => {
    if (args.length < 1) {
        throw 'Please enter the name or ID of the role youw ant to get the info for.';
    }

    const input = args.join(' ').toLowerCase();
    const role = message.mentions.roles.first() || message.guild.roles.cache.find(role => role.id === input || role.name.toLowerCase() === input);

    if (!role) {
        throw 'That role could not be found!';
    }

    message.channel.send(
        global.factory.embed()
            .setTitle(`${role.name}`)
            .setThumbnail(`http://placehold.it/100x100/${role.hexColor.slice(1)}/${role.hexColor.slice(1)}`)
            .setColor(role.color)
            .addField('Total members', message.guild.members.cache.filter(member => member.roles.cache.has(role.id)).size)
            .addField('Mentionable', role.mentionable ? 'Yes' : 'No')
            .addField('Color', role.hexColor)
            .addField('ID', role.id)
    );
};

export const info = {
    name: 'roleinfo',
    usage: 'roleinfo <role>',
    description: 'Gives you information about the given role.'
};
