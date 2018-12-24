exports.run = async (bot, msg, args) => {
    if (args.length < 2) {
        throw 'You must provide both a user and a reason!';
    }

    const member = msg.guild.members.get(args[0].substr(2, 18));
    if (!member) {
        throw 'That user could not be found!';
    }

    const reason = args.slice(1).join(' ');

    await member.user.send(`You were banned for **${reason}**`);
    member.ban({ reason });

    msg.channel.send(`Banned **${member.user.tag}**. :boom: :hammer:`);
};

exports.info = {
    name: 'ban',
    usage: 'ban <user> <reason>',
    description: 'Bans a user',
    perms: 'BAN_MEMBERS'
};
