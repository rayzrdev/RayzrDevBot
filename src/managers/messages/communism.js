const Manager = require('../manager');

class Communism extends Manager {
    getName() {
        return 'communism';
    }

    init(bot) {
        bot.on('message', msg => this.checkMessage(msg));

        bot.on('messageUpdate', (oldMsg, newMsg) => {
            if (oldMsg.content === newMsg.content) return;
            this.checkMessage(newMsg);
        });
    }

    checkMessage(msg) {
        if (msg.channel.id !== global.config.communismChannel) {
            return;
        }

        if (!/^\ud83e\udd54+$/.test(msg.content)) {
            msg.delete();
        }
    }
}

module.exports = Communism;
