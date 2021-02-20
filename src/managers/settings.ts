import {getDatabase} from '../helpers/db'
import {Manager} from './manager'

export class SettingsManager extends Manager {
    cache = {}

    getName(): string { return 'settings' }

    async get(key: string, options: { default?: any, cache?: boolean } = { default: undefined, cache: true }): Promise<any> {
        if (options.cache && this.cache[key]) {
            return this.cache[key]
        }

        const value = await getDatabase().get(key)

        if (options.cache) {
            this.cache[key] = value
        }

        if (options.default !== undefined && value === undefined) {
            return options.default
        }

        return value
    }

    async set(key: string, value: any, options = { cache: true }): Promise<void> {
        if (options.cache) {
            this.cache[key] = value
        }

        return await getDatabase().put(key, value)
    }
}

module.exports = SettingsManager
