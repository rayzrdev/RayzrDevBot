const Manager = require('../manager');

class ChannelFilter extends Manager {
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
