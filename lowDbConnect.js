const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

function initializeDb(dbName) {
    const adapter = new FileSync(`localStorage/${dbName}.json`);
    const db = low(adapter);
    db.defaults({ files: [] }).write();

    return db;
}

module.exports = initializeDb;