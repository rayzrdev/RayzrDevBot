import { Client, Message } from 'discord.js'
import { ManagerHandler } from '.'

export type ManagerType = Manager

/**
 * Represents a manager. Could manage commands, a config, a database, anything. Override individual methods to run setup.
 * 
 * @class Manager
 */
export abstract class Manager {
    private _handler: ManagerHandler
    private _bot: Client

    /**
     * Used to identify managers.
     * 
     * @returns The name of this manager. Overwrite to change from the default.
     * 
     * @memberof Manager
     */
    abstract getName(): string
    /**
     * Called when the bot loads, before it logs into Discord. Used for one-time setup methods.
     * 
     * @memberof Manager
     */
    preInit(bot: Client): void {
        return
    }

    /**
     * Called when the bot logs into Discord. Keep in mind, this may be called multiple times when running a bot if it has to reconnect to Discord.
     * 
     * @memberof Manager
     */
    init(): void {
        return
    }

    /**
     * Called when the bot disconnects from Discord.
     * 
     * @memberof Manager
     */
    disconnect(): void {
        return
    }

    /**
     * Called when the bot receives a message
     * 
     * @param {Message} message The message that was sent
     */
    onMessage(message: Message): void {
        return
    }

    /**
     * The ManagerHandler that owns this manager
     * 
     * @type {ManagerHandler}
     * 
     * @readonly
     * 
     * @memberof Manager
     */
    get handler(): ManagerHandler {
        return this._handler
    }

    /**
     * A reference to the bot object
     * 
     * @type {Discord.Client}
     * 
     * @readonly
     * 
     * @memberof Manager
     */
    get bot(): Client {
        return this._bot
    }
}

module.exports = Manager
