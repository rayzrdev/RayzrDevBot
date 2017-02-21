const RichEmbed = require('discord.js').RichEmbed;

exports.run = (bot, msg, args) => {
    var commands = {};

    if (args.length > 0) {
        if (!bot.commands[args[0]]) {
            msg.channel.sendMessage(`:no_entry_sign: The command '${args[0]}' doesn't exist!`);
            return;
        }
        commands = [bot.commands[args[0]]];
    } else {
        commands = bot.commands;
    }

    let fields = [];

    for (const key in commands) {
        let command = commands[key];
        if (!command.info.hidden) {
            fields.push(getField(bot, command));
        }
    }

    msg.channel.sendEmbed(
        new RichEmbed({ fields })
            .setTitle(`Help for ${bot.config.name}`)
            .setDescription('\n\u200b')
            .setColor(bot.config.color)
    );
};

function getField(bot, command) {
    return {
        name: command.info.name,
        value: `**Usage:** \`${bot.config.prefix}${command.info.usage}\`\n**Description:** ${command.info.description}`
    };
}

exports.info = {
    name: 'help',
    usage: 'help [command]',
    description: 'Shows help for all commands or an individual command'
};