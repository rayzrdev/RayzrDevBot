import path from 'path';
import fse from 'fs-extra';
import XPDB from 'xpdb';
import Manager from './manager';

class DataManager extends Manager {
    getName();

    preInit() {
        fse.mkdirpSync(global.settings.dataFolder);
        this.db = global.db = new XPDB(path.resolve(global.settings.dataFolder, 'database'));
    }
}

export default DataManager;
