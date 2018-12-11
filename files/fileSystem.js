const fs = require('fs-extra');
const path = require('path');

const isExist = (fileName) => 
    fs.existsSync(path.join(process.cwd(), 'public/imgs', fileName));

const writeFile = (fileName, data) =>
    fs.writeFile(path.join(process.cwd() , 'public/imgs', fileName), data);

const removeFile = (fileToBeDeleted) =>
    fs.remove(path.join(process.cwd(), 'public/imgs', fileToBeDeleted));

module.exports = {
    isExist,
    writeFile,
    removeFile,
}