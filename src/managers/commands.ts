import path from 'path';
// @ts-expect-error TS(7016): Could not find a declaration file for module 'fs-r... Remove this comment to see the full error message
import readdir from 'fs-readdir-recursive';
import chalk from 'chalk';
import Manager from './manager';

class CommandManager extends Manager {
    _commands: any;
    // @ts-expect-error TS(7010): 'getName', which lacks return-type annotation, imp... Remove this comment to see the full error message
    getName();

    // @ts-expect-error TS(2389): Function implementation name must be 'getName'.
    preInit() {
        this._commands = [];
        this.loadCommands();
    }

    init() {
        const bot = this.bot;

        this._commands.filter((command: any) => command && command.init)
            .forEach((command: any) => command.init(bot));
    }

    loadCommands() {
        const commandsFolder = path.resolve(__dirname, '..', 'commands');

        readdir(commandsFolder)
            .filter((file: any) => !path.basename(file).startsWith('_') && file.endsWith('.js'))
            .forEach((file: any) => {
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

    validateCommand(command: any) {
        if (typeof command !== 'object') return 'Exports are empty';
        if (typeof command.run !== 'function') return 'Missing run function';
        if (typeof command.info !== 'object') return 'Missing info object';
        if (typeof command.info.name !== 'string') return 'Info object missing "name"';
        if (typeof command.info.description !== 'string') return 'Info object missing "description"';
        return '';
    }

    _loadSingle(command: any, file: any) {
        const check = this.validateCommand(command);

        if (check) {
            return console.error(`Error in '${file}': ${chalk.red(check)}`);
        }

        if (this.findCommand(command.info.name)) {
            return console.error(`Duplicate command: An entry already exists for command ${chalk.red(command.info.name)} in file '${file}'`);
        }

        this._commands.push(command);
    }

    findCommand(input: any) {
        const lower = input.toLowerCase();

        return this._commands.find((command: any) => {
            return command.info.name.toLowerCase() === input.toLowerCase() ||
                (command.info.aliases && command.info.aliases.find((alias: any) => alias === lower));
        });
    }

    // @ts-expect-error TS(2391): Function implementation is missing or not immediat... Remove this comment to see the full error message
    canUse();

    // @ts-expect-error TS(7033): Property 'commands' implicitly has type 'any', bec... Remove this comment to see the full error message
    get commands();

    getContent(message: any) {
        const { content } = message;
        const { prefix } = (global as any).config;
        let out = '';

        if (content.startsWith(prefix)) {
            out = content.substr(prefix.length);
        } else if (content.startsWith(this.bot.user.toString())) {
            out = content.substr(this.bot.user.toString().length);
        }

        return out.trim();
    }

    async onMessage(message: any) {
        const content = this.getContent(message);
        if (!content) {
            return;
        }

        const args = content.split(' ');
        const label = args.shift();

        const command = this.findCommand(label);
        if (!command) {
            return;
        }

        this.executeCommand(command, message, args);
    }

    async executeCommand(command: any, message: any, args: any) {
        const permMessage = this._checkPermissions(message.member, command);
        if (permMessage) {
            return message.channel.send(`:no_entry_sign: ${permMessage}`)
                .then((m: any) => m.delete({timeout: 5000}));
        }

        try {
            await command.run(this.bot, message, args);
        } catch (err) {
            const displayMessage = `${err && (err as any).message || err || 'An unknown error has occurred!'}`;

            if (displayMessage == 'help') {
                return this.showHelp(command.info.name, message);
            }

            message.channel.send(`:x: ${displayMessage}`)
                .then((m: any) => m.delete({timeout: 5000}));
        }
    }

    _checkPermissions(member: any, command: any) {
        if (command.info.perms) {
            const perms = [].concat(command.info.perms);

            for (const perm of perms) {
                if (!member.hasPermission(perm)) {
                    return `You need the permission \`${perm}\` to use this command.`;
                }
            }
        }

        if (command.info.ownerOnly && member.id !== ((global as any).config.ownerID || '138048234819026944')) {
            return 'Only the owner of the bot can use this command.';
        }

        return '';
    }

    showHelp(command: any, message: any) {
        this.executeCommand(this.findCommand('help'), message, [command]);
    }
}

export default CommandManager;
