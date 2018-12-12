const { dbName } = require('../configurations').getServerConfigs();
const db = require('../lowDbConnect')(dbName);

const getFilesLow = () => db.get('files').value();

const setFileLow = newFile => db.get('files').push(newFile).write();

const updateFileLow = (fileToBeUpdated, newFilename, url) =>
    db.get('files').find({fileName: fileToBeUpdated}).assign({fileName: newFilename, url}).write();

const findFileLow = fileName => db.get('files').find({fileName}).value();

const removeFileLow = fileName => db.get('files').remove({ fileName }).write();

module.exports = {
    getFilesLow,
    setFileLow,
    updateFileLow,
    findFileLow,
    removeFileLow
}