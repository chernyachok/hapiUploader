import { Request as RequestExtended} from 'hapi';
import { ReadStream as ReadableStream } from 'fs-extra';

export interface Readable extends ReadableStream {
    hapi: {
        filename: string;
        headers: { [key: string]: string };
    };
    _data: Buffer;
}

export interface ReqPayload {
    id: number;
    newFilename: string;
    file: Readable;
    logo: Readable;
    username: string;
}

export interface Request extends RequestExtended {
    payload: ReqPayload;
}