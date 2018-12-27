const { stripIndents } = require('common-tags');

const generators = {
    channel: options => Object.assign({
        validator: input => /^<?#?\d{18}>?$/.test(input),
        mapper: input => input.replace(/[^0-9]/g, '')
    }, options)
};

const settings = {
    prefix: {},
    color: {
        validator: input => /^#?[a-fA-F0-9]{6}$/.test(input),
        mapper: input => (input.startsWith('#') ? '' : '#') + input
    },
    mainChannel: generators.channel(),
    countingChannel: generators.channel(),
    communismChannel: generators.channel(),
    statusFormat: {}
};

exports.run = async (bot, message, args) => {
    if (args.length < 1) {
        return message.channel.send(stripIndents`
            :information_source: **Available options:** ${Object.keys(settings).map(setting => `\`${setting}\``).join(', ')}
        `);
    }

    const settingName = args[0];
    if (!settings[settingName]) {
        throw 'That is not a valid setting.';
    }

    const setting = settings[settingName];

    if (args.length < 2) {
        const value = setting.getter ? setting.getter(global.config) : global.config[settingName];

        return message.channel.send(`:information_source: \`${settingName}\` = \`${value}\``);
    }

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
        setting.setter(global.config, value);
    } else {
        global.config[settingName] = value;
    }

    global.config.save();
    message.channel.send(`:white_check_mark: Updated value of \`${settingName}\` to be \`${value}\``);
};

exports.info = {
    name: 'settings',
    usage: 'settings [name] [value]',
    description: 'Displays or modifies a setting for the bot',
    ownerOnly: true
};
