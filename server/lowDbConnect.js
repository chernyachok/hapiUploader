const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const adapter = new FileSync('localStorage/db.json');
const db = low(adapter);
db.defaults({ files: [] }).write();

module.exports = db;