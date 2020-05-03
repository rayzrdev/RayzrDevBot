const Manager = require('../manager');

class Counting extends Manager {
    getName() {
        return 'counting';
    }

    preInit(bot) {
        bot.on('messageUpdate', (oldMsg, newMsg) => {
            if (oldMsg.content === newMsg.content) return;
            this.checkMessage(newMsg);
        });
    }

    onMessage(message) {
        this.checkMessage(message);
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
