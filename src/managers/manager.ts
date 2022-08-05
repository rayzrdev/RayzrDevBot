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
    // @ts-expect-error TS(7010): 'getName', which lacks return-type annotation, imp... Remove this comment to see the full error message
    getName();

    /**
     * Called when the bot loads, before it logs into Discord. Used for one-time setup methods.
     * 
     * @memberof Manager
     */
    // @ts-expect-error TS(2389): Function implementation name must be 'getName'.
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
    onMessage(message: any) { }

    /**
     * The ManagerHandler that owns this manager
     * 
     * @type {ManagerHandler}
     * 
     * @readonly
     * 
     * @memberof Manager
     */
    // @ts-expect-error TS(7033): Property 'handler' implicitly has type 'any', beca... Remove this comment to see the full error message
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
    // @ts-expect-error TS(7033): Property 'bot' implicitly has type 'any', because ... Remove this comment to see the full error message
    get bot();
}

export default Manager;
