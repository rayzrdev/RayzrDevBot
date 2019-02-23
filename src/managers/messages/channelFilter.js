const Manager = require('../manager');

class ChannelFilter extends Manager {
    init(bot) {
        bot.on('message', msg => this.checkMessage(msg));

        bot.on('messageUpdate', (oldMsg, newMsg) => {
            if (oldMsg.content === newMsg.content) return;
            this.checkMessage(newMsg);
        });
    }

    checkMessage(msg) {
        if (msg.channel.id !== getChannelID()) {
            return;
        }

        if (!global.config.communism.emojis.includes(msg.content.trim().toLowerCase())) {
            msg.delete();
        }
    }

    getChannelID() {
        return global.config[getName()].channel;
    }

    getEmojis() {
        return global.config[getName()].emojis;
    }
}

module.exports = ChannelFilter;
