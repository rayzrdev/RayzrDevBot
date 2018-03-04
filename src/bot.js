const path = require('path');
const chalk = require('chalk');
const Discord = require('discord.js');
const ManagerHandler = require('./managers');

global.settings = {
    baseDir: path.resolve(__dirname, '..'),
    dataFolder: path.resolve(__dirname, '..', 'data')
};

global.factory = require('./factory');

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
    .add('messages/ayy') // Because I can
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

const updateDisplay = () => {
    let totalUsers = 0;

    bot.guilds.forEach(g => {
        totalUsers += g.memberCount;

        if (!g.member(bot.user).hasPermission('MANAGE_CHANNELS')) {
            return;
        }


        const topic = config.statusFormat
            .replace(/{members}/g, g.memberCount)
            .replace(/{online}/g, g.members.filter(m => m.presence.status !== 'offline').size);

        // Check first to not spam the crap out of audit-log
        if (bot.channels.get(config.mainChannel).topic !== topic) {
            bot.channels.get(config.mainChannel).setTopic(topic);
        }
    });

    // bot.user.setGame(`${config.prefix}help | ${totalUsers} users`);
    bot.user.setPresence({ game: { name: `${config.prefix}help | ${totalUsers} users`, type: 0 } });
};

bot.on('guildMemberAdd', member => {
    bot.channels.get(config.mainChannel)
        .send(config.joinMessage.replace('{user}', `${member}`));

    managers.get('autorole').applyRoles(member);

    member.guild.owner.send(`${member} has joined ${member.guild}`);
});

process.on('unhandledRejection', err => {
    console.error(`Uncaught Promise rejection (${err.status}): ${err && err.stack || err}`);
});

bot.login(config.token);

module.exports = bot;
