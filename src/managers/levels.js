const path = require('path');
const XPDB = require('xpdb');

const db = new XPDB(path.join(__dirname, '../../levelsdb'));

class Levels {

    constructor() {
        this._speakTimes = {};
    }

    neededXP(n) {
        if (n < 0) return 0;
        return 5 * (n ** 2) + 50 * n + 100;
    }

    async remainingXP(id) {
        var xp = await this.getXP(id);
        var level = await this.getLevel(id);

        for (var i = 0; i < level; i++) {
            xp -= this.neededXP(i);
        }

        return xp;
    }

    _now() {
        return process.hrtime()[0];
    }

    _lastSpoke(id) {
        return this._speakTimes[id] || (this._speakTimes[id] = this._now());
    }

    async checkMessage(msg) {
        if (msg.author.bot) return;
        if (this._now() - this._lastSpoke(msg.author.id) < 60) {
            return;
        }
        this._speakTimes[msg.author.id] = this._now();

        var currentLevel = await this.getLevel(msg.author.id);
        await this.addXP(msg.author.id, 15 + (Math.random() * 10));
        var newLevel = await this.getLevel(msg.author.id);

        if (newLevel > currentLevel) {
            msg.author.sendMessage(`You're now level **${newLevel}** on **${msg.guild.name}**`);
        }
    }

    async getLevel(id) {
        return this.levelFromXP(await this.getXP(id));
    }

    levelFromXP(xp) {
        var level = 0;
        while (xp >= this.neededXP(level)) {
            xp -= this.neededXP(level);
            level++;
        }
        return level;
    }

    async getXP(id) {
        return await db.get(id) || 0;
    }

    async setXP(id, value) {
        await db.put(id, value);
    }

    async addXP(id, value) {
        var current = await this.getXP(id);
        await this.setXP(id, current + value);
    }

    async getTop(num) {
        var entries = await db.entries();
        return entries.sort((a, b) => b.value - a.value).splice(0, num);
    }
}

module.exports = Levels;