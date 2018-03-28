const Manager = require('../manager');

class AntiPingall extends Manager {
    getName() {
        return 'anti-pingall';
    }

    init(bot) {
        bot.on('message', message => {
            if (!message.guild || !message.guild.id) {
                return;
            }

            if (/^.{0,3}pingall/i.test(message.content)) {
                message.channel.send('<:OOF:401835306216718337>');
                message.member.addRole(message.guild.roles.find('name', 'Muted'));
            }
        });
    }
}

module.exports = AntiPingall;