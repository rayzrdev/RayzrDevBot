import { resolve } from 'path'
import { DATA_FOLDER } from './settings'
import XPDB from 'xpdb'

const DATABASE_DIR = resolve(DATA_FOLDER, 'database')

let db = null

export const getDatabase = () => {
    if (!db) {
        db = new XPDB(DATABASE_DIR)
    }

    return db
}
