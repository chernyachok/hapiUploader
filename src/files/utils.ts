import axios from 'axios';
import * as mime from 'mime';
import { ClientError } from '../constants';
import { getServerConfigs } from '../configurations';
import { Request, Readable } from '../types/request';
import { Response } from '../types/response';
import { FileApiResult } from './types';

type Validate = (file: Readable, allowedFormats: Array<string>) => boolean;

const { protocol, host, port } = getServerConfigs();

const isAccepted = (type: string, allowedFormats: Array<string>): boolean => allowedFormats.some(item => item === type);

const filterFile = (file: Readable) => (allowedFormats: Array<string>) => {
    const type = mime.getType(file.hapi.filename);
    return isAccepted(type, allowedFormats);
};

const createFileValidationHandler = 
    (validate: Validate) => 
        (fieldName: string, allowedFormats: Array<string>) => 
            (req: Request, h: Response) => {
                const file = req.payload[fieldName];
                if (!validate(file, allowedFormats)) {
                    return h.badData(ClientError.invalidFileFormat);
                }
                return true;
};

export const handleFileValidation = createFileValidationHandler(
    (file, allowedFormats) => filterFile(file)(allowedFormats)
);

export const getImageAllowedFormats = (): string[] => {
    return  [
            "image/png", 
            "image/jpg", 
            "image/jpeg"
        ];
};

export const getDocsAllowedFormats = (): string[] => {
    return [
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
};

export const workingUrl = (additional = ''): string => 
    protocol + '://' + host + ':' + port + additional;

export const getApi = async (url: string): Promise<Array<FileApiResult>> => {
    const { data } = await axios.get<Array<FileApiResult>>(url);
    return data;
};

export const getHtmlString = (data: Array<FileApiResult>): string => {
    let files = '';
        data.length && data.forEach((item: FileApiResult, index: number) => {
           if (index === 0) {
               let keysArr: string[] = [];
               for (let key in item) {
                if (item.hasOwnProperty(key)) {
                    keysArr.push(key);
                }
               }
               keysArr.forEach((item2: string, index2) => {
                   index2 === 0 ? files = '<tr>' : undefined;
            
                   files += `<th>${item2}</th>`;

                   index2 === (keysArr.length - 1) ? files += '</tr>' : undefined;
               });
           }
           files += `
            <tr>
                <td>${item.id}</td>
                <td>${item.filename}</td>
                <td><a href='${item.url}'>${item.url}</a></td>
            </tr>
           `;
        });
    
    return files ? `<table>${files}</table>` : '<h4>No files available!</h4>';
};
