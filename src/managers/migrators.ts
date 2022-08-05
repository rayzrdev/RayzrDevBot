import path from 'path';
// @ts-expect-error TS(7016): Could not find a declaration file for module 'fs-e... Remove this comment to see the full error message
import fse from 'fs-extra';
// @ts-expect-error TS(7016): Could not find a declaration file for module 'xpdb... Remove this comment to see the full error message
import XPDB from 'xpdb';
import Manager from './manager';

class Migrators extends Manager {
    async preInit() {
        const oldLevelsDB = path.resolve((global as any).settings.baseDir, 'levelsdb');

        if (fse.existsSync(oldLevelsDB)) {
            console.log('Starting level DB migration');

            const db = new XPDB(oldLevelsDB);
            const entries = await db.entries();

            console.log('Moving entries...');
            entries.forEach(async (entry: any) => {
                await (global as any).db.put(`level.${entry.key}`, entry.value);
            });

            console.log('Closing DB...');
            db.unwrap().close();
            console.log('Deleting DB...');
            fse.removeSync(oldLevelsDB);
        }
    }
}

export default Migrators;
