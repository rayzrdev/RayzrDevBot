const path = require('path');
const readdir = require('fs-readdir-recursive');
const chalk = require('chalk');

const Manager = require('./manager');

class CommandManager extends Manager {
    getName() {
        return 'commands';
    }

    preInit() {
        this._commands = [];
        this.loadCommands();
    }

    init() {
        const bot = this.bot;

        this._commands.filter(command => command && command.init)
            .forEach(command => command.init(bot));
    }

    validateCommand(command) {
        if (typeof command !== 'object') return 'Exports are empty';
        if (typeof command.run !== 'function') return 'Missing run function';
        if (typeof command.info !== 'object') return 'Missing info object';
        if (typeof command.info.name !== 'string') return 'Info object missing "name"';
        if (typeof command.info.usage !== 'string') return 'Info object missing "usage"';
        if (typeof command.info.description !== 'string') return 'Info object missing "description"';
        return '';
    }

    loadCommands() {
        const commandsFolder = path.resolve(__dirname, '..', 'commands');

        readdir(commandsFolder)
            .filter(file => !path.basename(file).startsWith('_') && file.endsWith('.js'))
            .forEach(file => {
                let command;

                try {
                    command = require(path.resolve(commandsFolder, file));
                } catch (error) {
                    return console.error(`Failed to load command file '${file}': ${error}`);
                }

                // Handle multi-command exports
                [].concat(command).forEach(single => this._loadSingle(single, file));
            });
    }

    _loadSingle(command, file) {
        const check = this.validateCommand(command);

        if (check) {
            return console.error(`Error in '${file}': ${chalk.red(check)}`);
        }

        if (this.findCommand(command.info.name)) {
            return console.error(`Duplicate command: An entry already exists for command ${chalk.red(command.info.name)} in file '${file}'`);
        }

        this._commands.push(command);
    }

    findCommand(input) {
        return this._commands.find(command => {
            return command.info.name.toLowerCase() === input.toLowerCase() ||
                (command.info.aliases && command.info.aliases.find(alias => alias.toLowerCase() === input.toLowerCase()));
        });
    }

    _checkPermissions(member, command) {
        if (command.info.perms) {
            const perms = [].concat(command.info.perms);

            for (const perm of perms) {
                if (!member.hasPermission(perm)) {
                    return `You need the permission \`${perm}\` to use this command.`;
                }
            }
        }

        if (command.info.ownerOnly && member.id !== (global.config.ownerID || '138048234819026944')) {
            return 'Only the owner of the bot can use this command.';
        }

        return '';
    }

    canUse(member, command) {
        return !this._checkPermissions(member, command);
    }

    get commands() {
        // Essentially return a clone
        return this._commands.slice(0);
    }

    showHelp(command, message) {
        this.executeCommand(this.findCommand('help'), message, [command]);
    }

    async executeCommand(command, message, args) {
        const permMessage = this._checkPermissions(message.member, command);
        if (permMessage) {
            return message.channel.send(`:no_entry_sign: ${permMessage}`)
                .then(m => m.delete(5000));
        }

        try {
            await command.run(this.bot, message, args);
        } catch (err) {
            const displayMessage = `${err && err.message || err || 'An unknown error has occurred!'}`;

            if (displayMessage == 'help') {
                return this.showHelp(command.info.name, message);
            }

            message.channel.send(`:x: ${displayMessage}`)
                .then(m => m.delete(5000));
        }
    }

    async onMessage(message) {
        const prefix = global.config.prefix;

        if (!message.content.startsWith(prefix)) {
            return;
        }

        const split = message.content.substr(prefix.length).trim().split(' ');
        const base = split[0];
        const args = split.slice(1);

        const command = this.findCommand(base);

        if (!command) {
            return;
        }

        this.executeCommand(command, message, args);
    }
}

module.exports = CommandManager;