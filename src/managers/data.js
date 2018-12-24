const path = require('path');
const fse = require('fs-extra');
const XPDB = require('xpdb');

const Manager = require('./manager');

class DataManager extends Manager {
    getName() {
        return 'data';
    }

    preInit() {
        fse.mkdirpSync(global.settings.dataFolder);
        this.db = global.db = new XPDB(path.resolve(global.settings.dataFolder, 'database'));
    }
}

module.exports = DataManager;
