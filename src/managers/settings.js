const Manager = require('./manager');

class SettingsManager extends Manager {
    getName() { return 'settings'; }

    preInit() {
        this.cache = {};
    }

    async get(key, options = { default: undefined, cache: true }) {
        if (options.cache && this.cache[key]) {
            return this.cache[key];
        }

        const value = await global.db.get(key);

        if (options.cache) {
            this.cache[key] = value;
        }

        if (options.default !== undefined && value === undefined) {
            return options.default;
        }

        return value;
    }

    async set(key, value, options = { cache: true }) {
        if (options.cache) {
            this.cache[key] = value;
        }

        return await global.db.put(key, value);
    }
}

module.exports = SettingsManager;
