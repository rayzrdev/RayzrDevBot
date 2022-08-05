import Manager from '../manager';

const keyPrefix = 'level.';

class Levels extends Manager {
    getName();

    preInit() {
        this._speakTimes = {};
        this.db = global.db;
    }

    neededXP(n) {
        if (n < 0) return 0;
        return 5 * (n ** 2) + 50 * n + 100;
    }

    remainingXP();

    remainingXPFromTotal(xp) {
        const level = this.levelFromXP(xp);

        for (let i = 0; i < level; i++) {
            xp -= this.neededXP(i);
        }

        return xp;
    }

    xpFromLevel(level) {
        let xp = 0;
        while (level >= 0) {
            xp += this.neededXP(level);
            level--;
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
        const total = await this.getXP(id);
        const currentLevel = await this.levelFromXP(total);
        const xpToLevel = this.neededXP(currentLevel);
        const remaining = await this.remainingXPFromTotal(total);

        const users = (await this.getUsers()).map(e => e.id);

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

    _now();

    _lastSpoke();

    async onMessage(message) {
        if (message.author.bot) return;
        if (this._now() - this._lastSpoke(message.author.id) < 60) {
            return;
        }
        this._speakTimes[message.author.id] = this._now();

        const currentLevel = await this.getLevel(message.author.id);
        await this.addXP(message.author.id, 15 + (Math.random() * 10));
        const newLevel = await this.getLevel(message.author.id);

        if (newLevel > currentLevel) {
            this.handler.events.emit('levelChange', {
                member: message.member,
                from: currentLevel,
                to: newLevel
            });

            message.author.send(`You're now level **${newLevel}** on **${message.guild.name}**`);
        }
    }

    getLevel();

    levelFromXP(xp) {
        let level = 0;
        while (xp >= this.neededXP(level)) {
            xp -= this.neededXP(level);
            level++;
        }
        return level;
    }

    getXP();

    async setXP(id, value) {
        await this.db.put(`${keyPrefix}${id}`, value);
    }

    async addXP(id, value) {
        const current = await this.getXP(id);
        await this.setXP(id, current + value);
    }

    getTop();

    getUsers();
}

export default Levels;
