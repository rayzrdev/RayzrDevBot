const RichEmbed = require('discord.js').RichEmbed;
const stripIndents = require('common-tags').stripIndents;

exports.run = (bot, msg, args) => {
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

    const fields = [];

    for (const key in commands) {
        const command = commands[key];

        if (!command.info.hidden) {
            fields.push(getField(bot, command));
        }
    }

    msg.delete();

    while (fields.length > 0) {
        msg.channel.send({
            embed: new RichEmbed({ fields: fields.splice(0, 15) })
                .setTitle(`Help for ${global.config.name}`)
                .setDescription('\n\u200b')
                .setFooter(`Requested by ${msg.author.tag}`)
                .setColor(global.config.color)
        });
    }


};

function getField(bot, command) {
    let description = stripIndents`
        **Usage:** \`${global.config.prefix}${command.info.usage}\`
        **Description:** ${command.info.description}
    `;

    if (command.info.aliases) {
        description += `\n**Aliases:** ${command.info.aliases.join(', ')}`;
    }

    return {
        name: command.info.name,
        value: description
    };
}

exports.info = {
    name: 'help',
    usage: 'help [command]',
    description: 'Shows help for all commands or an individual command'
};