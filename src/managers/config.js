const path = require('path');
const fse = require('fs-extra');
const Manager = require('./manager');

class ConfigManager extends Manager {
    getName() {
        return 'config';
    }

    preInit() {
        this._configPath = path.resolve(global.settings.baseDir, 'config.json');
        this._examplePath = this._configPath + '.example';

        this.loadConfig();
    }

    loadConfig() {
        if (!fse.existsSync(this._configPath)) {
            fse.copySync(this._examplePath, this._configPath);
            throw 'The config.json file was not set up, please fill it out.';
        }

        const config = fse.readJSONSync(this._configPath);

        if (!config.token || !/^[A-Za-z0-9._-]+$/.test(config.token)) {
            throw 'Config is missing a valid bot token! Please acquire one at https://discordapp.com/developers/applications/me';
        }

        this._config = global.config = config;
    }

    get config() {
        return Object.assign(this._config, { save: () => this.save() });
    }

    save() {
        fse.writeJSONSync(this._configPath, this._config);
    }
}

module.exports = ConfigManager;
