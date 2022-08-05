import path from 'path';
// @ts-expect-error TS(7016): Could not find a declaration file for module 'fs-e... Remove this comment to see the full error message
import fse from 'fs-extra';
import Manager from './manager';

class ConfigManager extends Manager {
    _config: any;
    _configPath: any;
    _examplePath: any;
    // @ts-expect-error TS(7010): 'getName', which lacks return-type annotation, imp... Remove this comment to see the full error message
    getName();

    // @ts-expect-error TS(2389): Function implementation name must be 'getName'.
    preInit() {
        this._configPath = path.resolve((global as any).settings.baseDir, 'config.json');
        this._examplePath = path.resolve((global as any).settings.baseDir, 'config-example.json');

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

        this._config = (global as any).config = config;
    }

    // @ts-expect-error TS(7033): Property 'config' implicitly has type 'any', becau... Remove this comment to see the full error message
    get config();

    save() {
        fse.writeFileSync(this._configPath, JSON.stringify(this._config, null, 4));
    }
}

export default ConfigManager;
