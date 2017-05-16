const chalk = require('chalk');
const Manager = require('./manager');
const EventEmitter = require('events');

/**
 * Handles all managers
 * 
 * @member {EventEmitter} events The EventEmitter that is shared between managers
 * @member {Manager[]} managers An array of all Manager objects
 * 
 * @class ManagerHandler
 */
class ManagerHandler {

    constructor() {
        this.events = new EventEmitter();
        this.managers = [];
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
     * 
     * @memberOf ManagerHandler
     */
    preInit() {
        this._setAll('handler', this);
        this._runAll('preInit');
    }

    /**
     * Calls init on all managers
     * 
     * 
     * @memberOf ManagerHandler
     */
    init(bot) {
        this.bot = bot;

        bot.on('message', message => {
            if (!message.guild || message.author.id === bot.user.id || message.author.bot) {
                return;
            }

            this.onMessage(message);
        });

        this._setAll('bot', bot);
        this._runAll('init', bot);
    }

    /**
     * Calls disconnect on all managers
     * 
     * 
     * @memberOf ManagerHandler
     */
    disconnect() {
        this._setAll('bot', undefined);
        this._runAll('disconnect');
    }

    /**
     * Calls onMessage on all managers
     * 
     * 
     * @memberOf ManagerHandler
     */
    onMessage(message) {
        this._runAll('onMessage', [message]);
    }
}

module.exports = ManagerHandler;