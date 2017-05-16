require('./polyfills');

const path = require('path');
const chalk = require('chalk');
const Discord = require('discord.js');
const ManagerHandler = require('./managers');

// require('readline').createInterface(process.stdin).on('line', line => {
//     try {
//         const output = eval(line);
//         console.log(output);
//     } catch (err) {
//         console.error('/!\\ Error: ', err);
//     }
// });

global.settings = {
    baseDir: path.resolve(__dirname, '..'),
    dataFolder: path.resolve(__dirname, '..', 'data')
};

const bot = new Discord.Client();

const managers = bot.managers = new ManagerHandler()
    .add('data')
    .add('config')
    .add('migrators')
    .add('settings')
    .add('ranks/levels')
    .add('ranks/autorole')
    .add('messages/logger')
    .add('messages/filter')
    .add('commands');

managers.preInit();

const config = global.config = managers.get('config').config;

bot.on('ready', () => {
    console.log('Running init...');
    managers.init(bot);

    bot.user.setAvatar(path.resolve(global.settings.baseDir, 'avatar.png')).catch(() => { });

    bot.setInterval(updateDisplay, 15000);
    updateDisplay();

    console.log('Bot has loaded successfully. We\'re in business!');

    bot.generateInvite(['MANAGE_MESSAGES', 'MANAGE_CHANNELS', 'BAN_MEMBERS', 'KICK_MEMBERS']).then(invite => {
        console.log(`Use the following link to invite ${config.name} to your server:\n` + chalk.blue(invite));
    });
});

function updateDisplay() {
    bot.user.setGame(`${config.prefix}help | ${bot.users.size} users`);

    bot.guilds.forEach(g => {
        g.defaultChannel.setTopic(`Members: ${g.memberCount} | Online: ${g.members.filter(m => m.presence.status !== 'offline').size}`);
    });
}

bot.on('guildMemberAdd', (member) => {
    member.guild.defaultChannel.send(config.joinMessage.replace('{user}', `<@${member.id}>`));
    member.guild.owner.send(`${member} has joined ${member.guild}`);
});

bot.on('message', message => {
    if (message.author.bot) return;

    if (/^ay+$/i.test(message.cleanContent)) {
        message.channel.send(`${message.cleanContent}${message.cleanContent.length > 1000 ? '' : 'yyyyy'}`);
    }
});

process.on('unhandledRejection', err => {
    console.error(`Uncaught Promise rejection (${err.status}): ${err && err.stack || err}`);
});

bot.login(config.token);

module.exports = bot;