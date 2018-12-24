const Manager = require('../manager');

class Counting extends Manager {
    getName() {
        return 'counting';
    }

    init(bot) {
        bot.on('message', msg => this.checkMessage(msg));

        bot.on('messageUpdate', (oldMsg, newMsg) => {
            if (oldMsg.content === newMsg.content) return;
            this.checkMessage(newMsg);
        });
    }

    checkMessage(msg) {
        if (msg.channel.id !== global.config.countingChannel) {
            return;
        }

        if (!/^\d+$/.test(msg.content)) {
            msg.delete();
        }
    }
}

module.exports = Counting;
