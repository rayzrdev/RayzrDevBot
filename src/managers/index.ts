import { Client, Message } from 'discord.js'
import { EventEmitter } from 'events'
import chalk from 'chalk'

import { ManagerType } from './manager'

/**
 * Handles all managers
 *
 * @class ManagerHandler
 */
export class ManagerHandler {
    readonly events: EventEmitter = new EventEmitter()
    readonly managers: ManagerType[] = []
    private bot: Client | undefined

    add(name: string): ManagerHandler {
        try {
            // TODO: this needs to go
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            const manager = require('./' + name)
            if (!manager.prototype) {
                throw 'Module exports must be a class.'
            }

            this.managers.push(new manager())
        } catch (err) {
            console.error(err)
            console.error(`Failed to load manager '${name}': ${err}`)
            process.exit(1)
        }

        return this
    }

    get<T extends ManagerType = ManagerType>(name: string): T {
        return this.managers.find(manager => manager.getName() === name) as T
    }

    _runAll(methodName: string, params?: any): void {
        if (!(params instanceof Array)) {
            params = [params]
        }

        this.managers.forEach(manager => {
            if (manager[methodName]) {
                try {
                    manager[methodName](...params)
                } catch (err) {
                    console.error(`Failed to run ${chalk.red(methodName)} on ${manager.getName()}: ${err}`)
                    process.exit(1)
                }
            }
        })
    }

    _setAll(property: string, value: any): void {
        this.managers.forEach(manager => manager[property] = value)
    }

    /**
     * Calls preInit on all managers
     *
     * @memberof ManagerHandler
     */
    preInit(bot: Client): void {
        this.bot = bot
        this._setAll('_handler', this)
        this._setAll('_bot', bot)
        this._runAll('preInit', bot)

        bot.on('message', message => {
            if (!message.guild || !message.member || message.author.id === bot.user.id || message.author.bot) {
                return
            }

            this.onMessage(message)
        })
    }

    /**
     * Calls init on all managers
     *
     * @memberof ManagerHandler
     */
    init(): void {
        this._runAll('init', this.bot)
    }

    /**
     * Calls disconnect on all managers
     *
     *
     * @memberof ManagerHandler
     */
    disconnect(): void {
        this._setAll('bot', undefined)
        this._runAll('disconnect')
    }

    /**
     * Calls onMessage on all managers
     *
     * @memberof ManagerHandler
     */
    onMessage(message: Message): void {
        this._runAll('onMessage', message)
    }
}

