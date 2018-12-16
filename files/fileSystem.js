const fs = require('fs-extra');
const path = require('path');

class FileSystem {
    constructor(staticF) {
        this._staticF = staticF;
        this._path = path.join(process.cwd(), 'public');
    }

    async writeFile(fileName, data) {
        fs.writeFile(path.join(this._path, this._staticF, fileName), data);
    }
    
    async removeFile(fileToBeDeleted) {
        fs.remove(path.join(this._path, this._staticF, fileToBeDeleted));
    }
    
    async renameFile(oldFileName, newFileName) {
        fs.rename(path.join(this._path, this._staticF, oldFileName), path.join(this._path, this._staticF, newFileName));
    }
    
    isExist(fileName) {
        return fs.existsSync(path.join(this._path, this._staticF, fileName));
    } 
   
}

module.exports = FileSystem;