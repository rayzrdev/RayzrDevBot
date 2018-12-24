exports.run = async (bot, msg, args) => {
    if (args.length < 2) {
        throw 'You must provide both a user and a reason!';
    }

    const member = msg.guild.members.get(args[0].substr(2, 18));
    if (!member) {
        throw 'That user could not be found!';
    }

    const reason = args.slice(1).join(' ');

    await member.user.send(`You were kicked for **${reason}**`);
    member.kick(reason);

    msg.channel.send(`Kicked **${member.user.tag}**. :boot: :zap:`);
};

exports.info = {
    name: 'kick',
    usage: 'kick <user> <reason>',
    description: 'Kicks a user',
    perms: 'KICK_MEMBERS'
};
