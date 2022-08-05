import Manager from '../manager';

class Counting extends Manager {
    getName();

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

export default Counting;
