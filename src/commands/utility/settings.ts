// @ts-expect-error TS(7016): Could not find a declaration file for module 'comm... Remove this comment to see the full error message
import { stripIndents } from 'common-tags';

const generators = {
    channel: (options: any) => Object.assign({
        validator: (input: any) => /^<?#?\d{18}>?$/.test(input),
        mapper: (input: any) => input.replace(/[^0-9]/g, '')
    }, options),
    array: (options: any) => Object.assign({
        isArray: true
    }, options)
};

const settings = {
    prefix: {},
    color: {
        validator: (input: any) => /^#?[a-fA-F0-9]{6}$/.test(input),
        mapper: (input: any) => (input.startsWith('#') ? '' : '#') + input
    },
    joinMessage: {},
    // @ts-expect-error TS(2554): Expected 1 arguments, but got 0.
    mainChannel: generators.channel(),
    // @ts-expect-error TS(2554): Expected 1 arguments, but got 0.
    countingChannel: generators.channel(),
    statusFormat: {},
    userRoles: generators.array({
        validator: (input: any) => /^(<@&)?\d{18}>?$/.test(input),
        mapper: (input: any) => input.replace(/[<>@&]/g, '')
    })
};

export const run = async (bot: any, message: any, args: any) => {
    if (args.length < 1) {
        return message.channel.send(stripIndents`
            :information_source: **Available options:** ${Object.keys(settings).map(setting => `\`${setting}\``).join(', ')}
        `);
    }

    const settingName = args[0];
    // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
    if (!settings[settingName]) {
        throw 'That is not a valid setting.';
    }

    // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
    const setting = settings[settingName];

    if (args.length < 2) {
        const value = setting.getter ? setting.getter((global as any).config) : (global as any).config[settingName];

        return message.channel.send(`:information_source: \`${settingName}\` = \`${setting.isArray ? 'Array' : value}\``);
    }

    if (setting.isArray) {
        const operation = args[1];
        const current = (setting.getter ? setting.getter((global as any).config) : (global as any).config[settingName]) || [];

        if (/^a(dd)?$/i.test(operation)) {
            if (args.length < 3) {
                throw 'Please enter a value to add to the array.';
            }

            let input = args.slice(2).join(' ');

            if (setting.validator && !setting.validator(input)) {
                throw 'That is not a valid value for that setting.';
            }

            let value = input;

            if (setting.mapper) {
                try {
                    value = await setting.mapper(input);
                } catch (error) {
                    throw 'Failed to parse input.';
                }
            }

            current.push(value);

            message.channel.send(`Added the value \`${input}\` to the setting \`${settingName}\`.`);
        } else if (/^r(em(ove)?)?$/i.test(operation)) {
            const index = parseInt(args[2]);

            if (isNaN(index)) {
                throw 'Please enter a valid index.';
            }

            if (index < 0 || index >= current.length) {
                throw 'That is not a valid index!';
            }

            current.splice(index, 1);

            message.channel.send(`Removed the value at index \`${index}\` from the setting \`${settingName}\`.`);
        } else if (/^l(ist)?$/i.test(operation)) {
            const output = current.map((item: any) => typeof setting.displayValue === 'function' ? setting.displayValue(item) : item)
                .join('\n');

            return message.channel.send(`Values for \`${settingName}\`:\n\`\`\`\n${output}\n\`\`\``);
        } else {
            throw 'Allowed operations: `add`, `remove`, `list`.';
        }

        if (setting.setter) {
            setting.setter((global as any).config, current);
        } else {
            (global as any).config[settingName] = current;
        }

        (global as any).config.save();
    } else {
        const input = args.slice(1).join(' ');

        if (setting.validator && !setting.validator(input)) {
            throw 'That is not a valid value for that setting.';
        }

        let value = input;

        if (value === 'null' || value === 'none') {
            value = null;
        } else if (setting.mapper) {
            try {
                value = await setting.mapper(input);
            } catch (error) {
                throw 'Failed to parse input.';
            }
        }

        if (setting.setter) {
            setting.setter((global as any).config, value);
        } else {
            (global as any).config[settingName] = value;
        }

        (global as any).config.save();
        message.channel.send(`:white_check_mark: Updated value of \`${settingName}\` to be \`${value}\``);
    }
};

export const info = {
    name: 'settings',
    usage: 'settings [name] [value]',
    description: 'Displays or modifies a setting for the bot',
    ownerOnly: true
};
