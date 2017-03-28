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
        return this.remainingXPFromTotal(await this.getXP(id));
    }

    remainingXPFromTotal(xp) {
        var level = this.levelFromXP(xp);

        for (var i = 0; i < level; i++) {
            xp -= this.neededXP(i);
        }

        return xp;
    }

    /**
     * Gets the data for a user
     * 
     * @param {string} id The user ID
     * @returns {Promise<{total: number, currentLevel: number, xpToLevel: number, remaining: number}>} The user data
     * 
     * @memberOf Levels
     */
    async getUserData(id) {
        var total = await this.getXP(id);
        var currentLevel = await this.levelFromXP(total);
        var xpToLevel = this.neededXP(currentLevel);
        var remaining = await this.remainingXPFromTotal(total);

        var users = (await this.getUsers()).map(e => e.key);

        return {
            total,
            currentLevel,
            xpToLevel,
            remaining,
            rank: {
                place: users.indexOf(id) + 1,
                total: users.length
            }
        };
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
        return (await this.getUsers()).splice(0, num);
    }

    async getUsers() {
        return (await db.entries()).sort((a, b) => b.value - a.value);
    }
}

module.exports = Levels;