import chalk from 'chalk';
import Manager from './manager';
import EventEmitter from 'events';

/**
 * Handles all managers
 * 
 * @class ManagerHandler
 */
class ManagerHandler {
    _events: any;
    _managers: any;
    bot: any;
    /**
     * Creates an instance of ManagerHandler.
     * 
     * @memberof ManagerHandler
     */
    constructor() {
        // @ts-expect-error TS(2351): This expression is not constructable.
        this._events = new EventEmitter();
        this._managers = [];
    }

    /**
     * The event bus
     * 
     * @type {EventEmitter}
     * 
     * @readonly
     * 
     * @memberof ManagerHandler
     */
    // @ts-expect-error TS(7033): Property 'events' implicitly has type 'any', becau... Remove this comment to see the full error message
    get events();

    /**
     * The array of managers
     * 
     * @type {Array<Manager>}
     * 
     * @readonly
     * 
     * @memberof ManagerHandler
     */
    // @ts-expect-error TS(7033): Property 'managers' implicitly has type 'any', bec... Remove this comment to see the full error message
    get managers();

    add(name: any) {
        try {
            const manager = require('./' + name);
            if (!manager.prototype) {
                throw 'Module exports must be a class.';
            }
            if (!(manager.prototype instanceof Manager)) {
                throw 'Class must extend Manager.';
            }

            this.managers.push(new manager());
        } catch (err) {
            console.error(`Failed to load manager '${name}': ${err}`);
            process.exit(1);
        }

        return this;
    }

    // @ts-expect-error TS(7010): 'get', which lacks return-type annotation, implici... Remove this comment to see the full error message
    get();

    // @ts-expect-error TS(2389): Function implementation name must be 'get'.
    _runAll(methodName: any, params: any) {
        if (!(params instanceof Array)) {
            params = [params];
        }

        this.managers.forEach((manager: any) => {
            if (manager[methodName]) {
                try {
                    manager[methodName].apply(manager, params);
                } catch (err) {
                    console.error(`Failed to run ${chalk.red(methodName)} on ${manager.getName()}: ${err}`);
                    process.exit(1);
                }
            }
        });
    }

    _setAll(property: any, value: any) {
        this.managers.forEach((manager: any) => manager[property] = value);
    }

    /**
     * Calls preInit on all managers
     * 
     * @memberof ManagerHandler
     */
    preInit(bot: any) {
        this.bot = bot;
        this._setAll('_handler', this);
        this._setAll('_bot', bot);
        this._runAll('preInit', bot);

        bot.on('message', (message: any) => {
            if (!message.guild || !message.member || message.author.id === bot.user.id || message.author.bot) {
                return;
            }

            this.onMessage(message);
        });
    }

    /**
     * Calls init on all managers
     * 
     * @memberof ManagerHandler
     */
    init() {
        this._runAll('init', this.bot);
    }

    /**
     * Calls disconnect on all managers
     * 
     * 
     * @memberof ManagerHandler
     */
    disconnect() {
        this._setAll('bot', undefined);
        // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
        this._runAll('disconnect');
    }

    /**
     * Calls onMessage on all managers
     * 
     * @memberof ManagerHandler
     */
    onMessage(message: any) {
        this._runAll('onMessage', message);
    }
}

export default ManagerHandler;
