import * as mime from 'mime';
import { ClientError } from '../constants';
import { 
    Request,
    Readable,
    Response,
} from '../types';

type Validate = (file: Readable, allowedFormats: Array<string>) => boolean;

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

export const getImageAllowedFormats = (list: Array<string>) =>
    list.filter(format => format.indexOf('image') !== -1);

export const getDocsAllowedFormats = (list: Array<string>) => 
    list.filter(format => format.indexOf('application') !== -1);

export const createUrl = (baseUrl: string, additional: string) =>
    baseUrl + additional;
