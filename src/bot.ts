import path from 'path';
import chalk from 'chalk';
import Discord from 'discord.js';
import ManagerHandler from './managers';

(global as any).settings = {
    baseDir: path.resolve(__dirname, '..'),
    dataFolder: path.resolve(__dirname, '..', 'data')
};

(global as any).factory = require('./factory');

const bot = new Discord.Client({
    ws: {
        intents: [
            'DIRECT_MESSAGES',
            'GUILD_MESSAGES',
            'GUILD_MEMBERS',
            'GUILDS',
        ]
    }
});

const managers = (bot as any).managers = new ManagerHandler()
    .add('data')
    .add('config')
    .add('migrators')
    .add('settings')
    // Ranks system
    .add('ranks/levels')
    .add('ranks/autorole')
    // Message moderation
    .add('messages/logger')
    .add('messages/filter')
    .add('messages/anti-pingall')
    .add('messages/ayy') // Because I can
    // Channel filter managers
    .add('messages/counting')
    .add('messages/communism')
    .add('messages/capitalism')
    .add('commands');

managers.preInit(bot);

// @ts-expect-error TS(2554): Expected 0 arguments, but got 1.
const config = (global as any).config = managers.get('config').config;

bot.on('ready', () => {
    console.log('Running init...');
    managers.init();

    bot.setInterval(updateDisplay, 15000);
    updateDisplay();

    console.log('Bot has loaded successfully. We\'re in business!');

    bot.generateInvite({
        permissions: ['MANAGE_MESSAGES', 'MANAGE_CHANNELS', 'BAN_MEMBERS', 'KICK_MEMBERS']
    })
        .then(invite => console.log(chalk.blue(invite)));
});

const updateDisplay = async () => {
    const totalUsers = bot.guilds.cache.reduce((total, guild) => total + guild.memberCount, 0);
    const totalOnline = bot.users.cache.filter(user => user.presence.status !== 'offline').size;

    const topic = config.statusFormat
        .replace(/{members}/g, totalUsers)
        .replace(/{online}/g, totalOnline);

    try {
        const channel = await bot.channels.fetch(config.mainChannel);

        // Check first to not spam the crap out of audit-log
        if ((channel as any).topic !== topic) {
            (channel as any).setTopic(topic);
        }
    } catch (e) {
        console.warn(`Main channel could not be found! ID: ${config.mainChannel}`);
    }

    // @ts-expect-error TS(2531): Object is possibly 'null'.
    bot.user.setPresence({
        activity: {
            name: `${config.prefix}help | ${totalUsers} users`,
            type: 'PLAYING'
        }
    });
};

bot.on('guildMemberAdd', member => {
    bot.channels.fetch(config.mainChannel).then(channel => (channel as any).send(config.joinMessage.replace('{user}', `${member}`)));

    // @ts-expect-error TS(2531): Object is possibly 'null'.
    member.guild.owner.send(`> \`${member.guild}\` | **New member:** ${member} - \`${member.user.tag}\``);
});

process.on('exit', () => {
    bot.destroy();
});

bot.on('warn', console.warn);
bot.on('error', console.error);

bot.login(config.token);

export default bot;
