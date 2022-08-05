/**
 * Represents a manager. Could manage commands, a config, a database, anything. Override individual methods to run setup.
 * 
 * @class Manager
 */
class Manager {
    /**
     * Used to identify managers.
     * 
     * @returns The name of this manager. Overwrite to change from the default.
     * 
     * @memberof Manager
     */
    getName();

    /**
     * Called when the bot loads, before it logs into Discord. Used for one-time setup methods.
     * 
     * @memberof Manager
     */
    preInit() { }

    /**
     * Called when the bot logs into Discord. Keep in mind, this may be called multiple times when running a bot if it has to reconnect to Discord.
     * 
     * @memberof Manager
     */
    init() { }

    /**
     * Called when the bot disconnects from Discord.
     * 
     * @memberof Manager
     */
    disconnect() { }

    /**
     * Called when the bot receives a message
     * 
     * @param {Message} message The message that was sent
     */
    onMessage(message) { }

    /**
     * The ManagerHandler that owns this manager
     * 
     * @type {ManagerHandler}
     * 
     * @readonly
     * 
     * @memberof Manager
     */
    get handler();

    /**
     * A reference to the bot object
     * 
     * @type {Discord.Client}
     * 
     * @readonly
     * 
     * @memberof Manager
     */
    get bot();
}

export default Manager;
