import * as fs from 'fs-extra';
import * as path from 'path';

export default class FileSystem {

    private _path: string;

    constructor(uploadDir: string) {
        this._path = path.join(process.cwd(), uploadDir);
    }
   
    async writeFile(fileName: string, data: Buffer): Promise<void> {
        fs.writeFile(path.join(this._path, fileName), data);
    }

    async removeFile(fileToBeDeleted: string): Promise<void> {
        fs.remove(path.join(this._path, fileToBeDeleted));
    }

    async renameFile(oldFileName: string, newFileName: string): Promise<void> {
        fs.rename(path.join(this._path, oldFileName), path.join(this._path, newFileName));
    }
    
    isExist(fileName: string): boolean {
        return fs.existsSync(path.join(this._path, fileName));
    } 
   
}
