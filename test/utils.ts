import FormData from 'form-data';
import * as path from 'path';
import * as fs from 'fs-extra';
import { ReadStream } from 'fs-extra';

export const createFormData = () => {
    const formData = new FormData();
    return formData;
};

export const getFileStream = (fileName: string): ReadStream => {
    const fileStream = fs.createReadStream(path.join(__dirname, 'mocks', fileName));
    return fileStream;
};

export const appendFiles = (formData: FormData, fileNames: string[], fieldName: string = 'file') => {
    fileNames.forEach(fileName => {
        const fileStream = getFileStream(fileName);
            
        formData.append(fieldName, fileStream);
      });
    
      return formData;
};

export const clearDirectory = async (url: string) => {
    const files = fs.readdirSync(url);
    files.forEach(async (filename: string) => {
        fs.unlink(url + `/${filename}`);
    });
};