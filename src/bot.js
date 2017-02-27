/**
 * @param {string} input The input to check
 * @memberof JSON
 */
JSON.isJSON = function (input) {
    try {
        JSON.parse(input);
        return true;
    } catch (err) {
        return false;
    }
};

const Discord = require('discord.js');
const path = require('path');
const chalk = require('chalk');
const fs = require('fs');
const fse = require('fs-extra');
const read = require('fs-readdir-recursive');

const bot = new Discord.Client();
const commands = bot.commands = {};

const levels = bot.levels = new (require('./managers/levels'))();

let invite_template = 'https://discordapp.com/api/oauth2/authorize?client_id=YOUR_CLIENT_ID&scope=bot&permissions=268443648';

process.on('unhandledRejection', err => {
    console.error(`Uncaught error (${err.status}): ${err.response ? JSON.parse(err.response.text).message : err}`);
});

try {
    if (!fs.existsSync(path.resolve(__dirname, 'config.json'))) {
        fse.copySync(path.resolve(__dirname, 'config.json.example'), path.resolve(__dirname, 'config.json'));
        console.log('Copied default config.json file. After you fill it out, please restart the bot.');
        process.exit(1);
    }
} catch (e) {
    console.error('Failed to check validity of the config.json file:\n' + e);
    process.exit(1);
}

const config = bot.config = require('./config.json');

if (!config.token || !/^[A-Za-z0-9\._\-]+$/.test(config.token)) {
    console.error('Config is missing a valid bot token! Please acquire one at https://discordapp.com/developers/applications/me');
    process.exit(1);
}

function validateCommand(command) {
    if (typeof command !== 'object') return 'Exports are empty';
    if (typeof command.run !== 'function') return 'Missing run function';
    if (typeof command.info !== 'object') return 'Missing info object';
    if (typeof command.info.name !== 'string') return 'Info object missing "name"';
    if (typeof command.info.usage !== 'string') return 'Info object missing "usage"';
    if (typeof command.info.description !== 'string') return 'Info object missing "description"';
    return '';
}

function loadCommands() {
    read(path.resolve(__dirname, 'commands'), file => !file.startsWith('_') && file.endsWith('.js')).forEach(file => {
        var command = require(path.resolve(__dirname, 'commands', file));
        var check = validateCommand(command);
        if (check) {
            console.log(`Error in "${file}": ${chalk.red(check)}`);
            return;
        }
        if (commands[command.info.name]) {
            console.log(`Duplicate command: An entry already exists for command ${chalk.red(command.info.name)} in file "${file}"`);
        }
        commands[command.info.name] = command;
    });
}

function time(callback) {
    let start = process.hrtime();
    callback();
    let diff = process.hrtime(start);
    return (diff[0] + diff[1] / 1e6).toFixed(2);
}

bot.on('guildMemberAdd', (member) => {
    member.guild.defaultChannel.sendMessage(bot.config.joinMessage.replace('{user}', `<@${member.id}>`));
    member.guild.owner.sendMessage(`${member} has joined ${member.guild}`);
});

bot.on('ready', () => {
    console.log('Loading commands...');
    var loadTime = time(loadCommands);
    console.log(`Commands loaded in ${loadTime}ms.`);

    bot.user.setAvatar(path.resolve(__dirname, '../avatar.png'));
    bot.user.setGame(`${config.prefix}help`);

    updateTopics();
    bot.setInterval(updateTopics, 15000);

    console.log('Bot has loaded successfully. We\'re in business!');

    console.log(`Use the following link to invite ${config.name} to your server:\n` + chalk.blue(invite_template.replace('YOUR_CLIENT_ID', bot.user.id)));
});

function updateTopics() {
    bot.guilds.forEach(g => {
        g.defaultChannel.setTopic(`Members: ${g.memberCount} | Online: ${g.members.filter(m => m.presence.status !== 'offline').size}`);
    });
}

bot.on('message', (msg) => {
    if (!msg.guild || msg.author.id === bot.user.id || msg.author.bot) return;

    levels.checkMessage(msg);

    if (!msg.content.startsWith(config.prefix)) return;
    let content = msg.content.substr(config.prefix.length);
    let command = content.split(' ')[0];
    let args = content.split(' ').splice(1);
    if (commands[command]) {
        try {
            msg.editEmbed = (embed) => {
                msg.edit('', { embed });
            };
            commands[command].run(bot, msg, args);
        } catch (e) {
            msg.edit('Failed to run command:\n```' + e + '```').then(m => m.delete(5000));
        }
    }
});

function logMessageStatus(msg, type, color, description) {
    if (!msg.guild || !msg.guild.channel || !msg.cleanContent)
        return;
    var channel = msg.guild.channels.find('name', 'logs');
    if (channel) {
        channel.sendEmbed(
            new Discord.RichEmbed()
                .setTitle(type)
                .setDescription(`\`\`\`\n${(description || msg.cleanContent).substr(0, 1950)}\n\`\`\`\n **Channel:** ${msg.channel}`)
                .setColor(color)
                .setTimestamp(new Date())
                .setFooter(msg.author.username, msg.author.avatarURL)
        );
    }
}

bot.on('messageDelete', msg => {
    logMessageStatus(msg, 'Deleted', [255, 20, 50]);
});

bot.on('messageDeleteBulk', msgs => {
    msgs.array().forEach(msg => {
        logMessageStatus(msg, 'Bulk Deleted', [255, 60, 100]);
    });
});

bot.on('messageUpdate', (oldMsg, newMsg) => {
    if (oldMsg.content === newMsg.content) return;
    logMessageStatus(oldMsg, 'Edited', [250, 215, 30], `${oldMsg.cleanContent}\n\`\`\` \`\`\`\n${newMsg.cleanContent}`);
});

bot.login(config.token);

module.exports = bot;