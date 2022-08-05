import Manager from '../manager';

const keyPrefix = 'level.';

class Levels extends Manager {
    _speakTimes: any;
    db: any;
    // @ts-expect-error TS(7010): 'getName', which lacks return-type annotation, imp... Remove this comment to see the full error message
    getName();

    // @ts-expect-error TS(2389): Function implementation name must be 'getName'.
    preInit() {
        this._speakTimes = {};
        this.db = (global as any).db;
    }

    neededXP(n: any) {
        if (n < 0) return 0;
        return 5 * (n ** 2) + 50 * n + 100;
    }

    // @ts-expect-error TS(7010): 'remainingXP', which lacks return-type annotation,... Remove this comment to see the full error message
    remainingXP();

    // @ts-expect-error TS(2389): Function implementation name must be 'remainingXP'... Remove this comment to see the full error message
    remainingXPFromTotal(xp: any) {
        const level = this.levelFromXP(xp);

        for (let i = 0; i < level; i++) {
            xp -= this.neededXP(i);
        }

        return xp;
    }

    xpFromLevel(level: any) {
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
    async getUserData(id: any) {
        // @ts-expect-error TS(2554): Expected 0 arguments, but got 1.
        const total = await this.getXP(id);
        const currentLevel = await this.levelFromXP(total);
        const xpToLevel = this.neededXP(currentLevel);
        const remaining = await this.remainingXPFromTotal(total);

        const users = (await this.getUsers()).map((e: any) => e.id);

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

    // @ts-expect-error TS(2391): Function implementation is missing or not immediat... Remove this comment to see the full error message
    _now();

    // @ts-expect-error TS(7010): '_lastSpoke', which lacks return-type annotation, ... Remove this comment to see the full error message
    _lastSpoke();

    // @ts-expect-error TS(2389): Function implementation name must be '_lastSpoke'.
    async onMessage(message: any) {
        if (message.author.bot) return;
        // @ts-expect-error TS(2554): Expected 0 arguments, but got 1.
        if (this._now() - this._lastSpoke(message.author.id) < 60) {
            return;
        }
        this._speakTimes[message.author.id] = this._now();

        // @ts-expect-error TS(2554): Expected 0 arguments, but got 1.
        const currentLevel = await this.getLevel(message.author.id);
        await this.addXP(message.author.id, 15 + (Math.random() * 10));
        // @ts-expect-error TS(2554): Expected 0 arguments, but got 1.
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

    // @ts-expect-error TS(7010): 'getLevel', which lacks return-type annotation, im... Remove this comment to see the full error message
    getLevel();

    // @ts-expect-error TS(2389): Function implementation name must be 'getLevel'.
    levelFromXP(xp: any) {
        let level = 0;
        while (xp >= this.neededXP(level)) {
            xp -= this.neededXP(level);
            level++;
        }
        return level;
    }

    // @ts-expect-error TS(7010): 'getXP', which lacks return-type annotation, impli... Remove this comment to see the full error message
    getXP();

    // @ts-expect-error TS(2389): Function implementation name must be 'getXP'.
    async setXP(id: any, value: any) {
        await this.db.put(`${keyPrefix}${id}`, value);
    }

    async addXP(id: any, value: any) {
        // @ts-expect-error TS(2554): Expected 0 arguments, but got 1.
        const current = await this.getXP(id);
        await this.setXP(id, current + value);
    }

    // @ts-expect-error TS(2391): Function implementation is missing or not immediat... Remove this comment to see the full error message
    getTop();

    // @ts-expect-error TS(2391): Function implementation is missing or not immediat... Remove this comment to see the full error message
    getUsers();
}

export default Levels;
