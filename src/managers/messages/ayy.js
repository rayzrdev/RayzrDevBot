const Manager = require('../manager');

// Milliseconds - How long to wait in between AYYYs
const COOLDOWN_TIME = 5000;

class AyyManager extends Manager {
    getName() { return 'filter'; }

    init() {
        this.clearCooldowns();

        this.bot.setInterval(this.clearCooldowns.bind(this), 1800000 /* 30 * 60 * 1000 -- 30 minutes */);
    }

    clearCooldowns() {
        this.cooldowns = {};
    }

    onMessage(message) {
        if (!/^ay+$/i.test(message.cleanContent)) {
            return;
        }

        const now = Date.now();
        if (this.cooldowns[message.author.id] && now - this.cooldowns[message.author.id] < COOLDOWN_TIME) {
            message.delete();
            message.channel.send('plzno ._.').then(m => m.delete(5000));
            return;
        }

        this.cooldowns[message.author.id] = now;

        const content = message.cleanContent;
        const percentUpper = content.substr(1).split('').filter(c => c === 'Y').reduce(mem => mem + 1, 0) / (content.length - 1);
        const length = Math.min(content.length + 5, 2000);

        let output = content[0];

        for (let i = 1; i < length; i++) {
            output += Math.random() > percentUpper ? 'y' : 'Y';
        }

        message.channel.send(output);
    }
}

module.exports = AyyManager;
