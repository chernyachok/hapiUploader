import * as fs from 'fs-extra';
const path = require('path');

class FileSystem {
    constructor(pathToImgs) {
        this._path = path.join(process.cwd(), 'public', pathToImgs);
    }

    async writeFile(fileName, data) {
        fs.writeFile(path.join(this._path, fileName), data);
    }
    
    async removeFile(fileToBeDeleted) {
        fs.remove(path.join(this._path, fileToBeDeleted));
    }
    
    async renameFile(oldFileName, newFileName) {
        fs.rename(path.join(this._path, oldFileName), path.join(this._path, newFileName));
    }
    
    isExist(fileName) {
        return fs.existsSync(path.join(this._path, fileName));
    } 
   
}

module.exports = FileSystem;