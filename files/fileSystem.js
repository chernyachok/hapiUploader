const fs = require('fs-extra');
const path = require('path');

const imgsDir = path.join(process.cwd(), 'public/imgs');

const isExist = (fileName) => 
    fs.existsSync(path.join(imgsDir, fileName));

const writeFile = async (fileName, data) =>
    fs.writeFile(path.join(imgsDir, fileName), data);

const removeFile = async (fileToBeDeleted) =>
    fs.remove(path.join(imgsDir, fileToBeDeleted));

const renameFile = async (oldFileName, newFileName) =>
    fs.rename(path.join(imgsDir, oldFileName), path.join(imgsDir, newFileName));

module.exports = {
    isExist,
    writeFile,
    removeFile,
    renameFile
}