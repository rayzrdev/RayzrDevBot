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
        if (msg.channel.id !== this.getChannelID()) {
            return;
        }

        if (!this.getEmojis().includes(msg.content.trim().toLowerCase())) {
            msg.delete();
        }
    }

    getChannelID() {
        return global.config[this.getName()].channel;
    }

    getEmojis() {
        return global.config[this.getName()].emojis;
    }
}

module.exports = ChannelFilter;
