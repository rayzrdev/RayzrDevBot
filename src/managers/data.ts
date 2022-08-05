import path from 'path';
// @ts-expect-error TS(7016): Could not find a declaration file for module 'fs-e... Remove this comment to see the full error message
import fse from 'fs-extra';
// @ts-expect-error TS(7016): Could not find a declaration file for module 'xpdb... Remove this comment to see the full error message
import XPDB from 'xpdb';
import Manager from './manager';

class DataManager extends Manager {
    db: any;
    // @ts-expect-error TS(7010): 'getName', which lacks return-type annotation, imp... Remove this comment to see the full error message
    getName();

    // @ts-expect-error TS(2389): Function implementation name must be 'getName'.
    preInit() {
        fse.mkdirpSync((global as any).settings.dataFolder);
        this.db = (global as any).db = new XPDB(path.resolve((global as any).settings.dataFolder, 'database'));
    }
}

export default DataManager;
