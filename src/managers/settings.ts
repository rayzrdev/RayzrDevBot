import Manager from './manager';

class SettingsManager extends Manager {
    cache: any;
    // @ts-expect-error TS(7010): 'getName', which lacks return-type annotation, imp... Remove this comment to see the full error message
    getName();

    // @ts-expect-error TS(2389): Function implementation name must be 'getName'.
    preInit() {
        this.cache = {};
    }

    async get(key: any, options = { default: undefined, cache: true }) {
        if (options.cache && this.cache[key]) {
            return this.cache[key];
        }

        const value = await (global as any).db.get(key);

        if (options.cache) {
            this.cache[key] = value;
        }

        if (options.default !== undefined && value === undefined) {
            return options.default;
        }

        return value;
    }

    async set(key: any, value: any, options = { cache: true }) {
        if (options.cache) {
            this.cache[key] = value;
        }

        return await (global as any).db.put(key, value);
    }
}

export default SettingsManager;
