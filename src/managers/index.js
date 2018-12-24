const chalk = require('chalk');
const Manager = require('./manager');
const EventEmitter = require('events');

/**
 * Handles all managers
 * 
 * @class ManagerHandler
 */
class ManagerHandler {
    /**
     * Creates an instance of ManagerHandler.
     * 
     * @memberof ManagerHandler
     */
    constructor() {
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
    get events() {
        return this._events;
    }

    /**
     * The array of managers
     * 
     * @type {Array<Manager>}
     * 
     * @readonly
     * 
     * @memberof ManagerHandler
     */
    get managers() {
        return this._managers;
    }

    add(name) {
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

    get(name) {
        return this.managers.find(manager => manager.getName() === name);
    }

    _runAll(methodName, params) {
        if (!(params instanceof Array)) {
            params = [params];
        }

        this.managers.forEach(manager => {
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

    _setAll(property, value) {
        this.managers.forEach(manager => manager[property] = value);
    }

    /**
     * Calls preInit on all managers
     * 
     * @memberof ManagerHandler
     */
    preInit() {
        this._setAll('_handler', this);
        this._runAll('preInit');
    }

    /**
     * Calls init on all managers
     * 
     * @memberof ManagerHandler
     */
    init(bot) {
        this.bot = bot;

        bot.on('message', message => {
            if (!message.guild || !message.member || message.author.id === bot.user.id || message.author.bot) {
                return;
            }

            this.onMessage(message);
        });

        this._setAll('_bot', bot);
        this._runAll('init', bot);
    }

    /**
     * Calls disconnect on all managers
     * 
     * 
     * @memberof ManagerHandler
     */
    disconnect() {
        this._setAll('bot', undefined);
        this._runAll('disconnect');
    }

    /**
     * Calls onMessage on all managers
     * 
     * @memberof ManagerHandler
     */
    onMessage(message) {
        this._runAll('onMessage', [message]);
    }
}

module.exports = ManagerHandler;
