import path from 'path';
import fse from 'fs-extra';
import Manager from './manager';

class ConfigManager extends Manager {
    getName();

    preInit() {
        this._configPath = path.resolve(global.settings.baseDir, 'config.json');
        this._examplePath = path.resolve(global.settings.baseDir, 'config-example.json');

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

    get config();

    save() {
        fse.writeFileSync(this._configPath, JSON.stringify(this._config, null, 4));
    }
}

export default ConfigManager;
