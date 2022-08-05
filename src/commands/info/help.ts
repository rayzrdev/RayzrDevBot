export const run = (bot: any, msg: any, args: any) => {
    const manager = bot.managers.get('commands');

    let commands = {};

    if (args.length > 0) {
        const command = manager.findCommand(args[0]);
        if (!command) {
            throw `The command '${args[0]}' doesn't exist!`;
        }
        commands = [command];
    } else {
        commands = manager.commands;
    }

    const fields = (commands as any).filter((command: any) => !command.info.hidden)
    .filter((command: any) => manager.canUse(msg.member, command))
    .map(getField);

    while (fields.length > 0) {
        msg.author.send({
    embed: (global as any).factory.embed({
        fields: fields.splice(0, 20)
    })
});
    }

    msg.delete().catch(() => {});
    msg.channel.send(':inbox_tray: Sent you a DM with help.').then((m: any) => m.delete({timeout: 5000}));
};

const getField = (command: any) => {
    let value = `*${command.info.description}*`;

    if (command.info.aliases) {
        value += `\n*Aliases:* **\`${command.info.aliases.join(', ')}\`**`;
    }

    return {
        name: `\`${command.info.usage || command.info.name}\``,
        value: value
    };
};

export const info = {
    name: 'help',
    usage: 'help [command]',
    description: 'Shows help for all commands or an individual command'
};
