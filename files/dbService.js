const db = require('../lowDbConnect');

const getFilesLow = () => db.get('files').value();

const setFileLow = newFile => db.get('files').push(newFile).write();

const findFileLow = fileName => db.get('files').find({fileName}).value();

const removeFileLow = fileName => db.get('files').remove({ fileName }).write();

module.exports = {
    getFilesLow,
    setFileLow,
    findFileLow,
    removeFileLow
}