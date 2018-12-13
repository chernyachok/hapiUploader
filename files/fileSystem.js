const fs = require('fs-extra');
const path = require('path');

const imgsDir = path.join(process.cwd(), 'public/imgs');

const isExist = (fileName) => 
    fs.existsSync(path.join(imgsDir, fileName));

const writeFile = (fileName, data) =>
    fs.writeFile(path.join(imgsDir, fileName), data);

const removeFile = (fileToBeDeleted) =>
    fs.remove(path.join(imgsDir, fileToBeDeleted));

const renameFile = (oldFileName, newFileName) =>
    fs.rename(path.join(imgsDir, oldFileName), path.join(imgsDir, newFileName));

module.exports = {
    isExist,
    writeFile,
    removeFile,
    renameFile
}