/**
 * Represents a manager. Could manage commands, a config, a database, anything. Override individual methods to run setup.
 * 
 * @member {object} handler The ManagerHandler instance. Only available starting with preInit().
 * @member {object} bot The bot instance. Only available between init() and disconnect().
 * 
 * @class Manager
 */
class Manager {
    /**
     * Used to identify managers.
     * 
     * @returns The name of this manager. Overwrite to change from the default.
     * 
     * @memberOf Manager
     */
    getName() {
        return '[Manager]';
    }

    /**
     * Called when the bot loads, before it logs into Discord. Used for one-time setup methods.
     * 
     * @memberOf Manager
     */
    preInit() { }

    /**
     * Called when the bot logs into Discord. Keep in mind, this may be called multiple times when running a bot if it has to reconnect to Discord.
     * 
     * @memberOf Manager
     */
    init() { }

    /**
     * Called when the bot disconnects from Discord.
     * 
     * @memberOf Manager
     */
    disconnect() { }
}

module.exports = Manager;