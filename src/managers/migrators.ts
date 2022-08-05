import path from 'path';
import fse from 'fs-extra';
import XPDB from 'xpdb';
import Manager from './manager';

class Migrators extends Manager {
    async preInit() {
        const oldLevelsDB = path.resolve(global.settings.baseDir, 'levelsdb');

        if (fse.existsSync(oldLevelsDB)) {
            console.log('Starting level DB migration');

            const db = new XPDB(oldLevelsDB);
            const entries = await db.entries();

            console.log('Moving entries...');
            entries.forEach(async entry => {
                await global.db.put(`level.${entry.key}`, entry.value);
            });

            console.log('Closing DB...');
            db.unwrap().close();
            console.log('Deleting DB...');
            fse.removeSync(oldLevelsDB);
        }
    }
}

export default Migrators;
