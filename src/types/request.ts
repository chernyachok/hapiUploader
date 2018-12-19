import { Request as RequestExtended} from 'hapi';
import { Readable as ReadableStream } from 'stream';

export interface Readable extends ReadableStream {
    hapi: {
        filename: string;
        headers: { [key: string]: string };
    },
    _data: Buffer;
}

export interface ReqPayload {
    id?: number;
    newFilename?: string;
    file?: Readable;
    logo?: Readable;
}

export interface Request extends RequestExtended {
    payload: ReqPayload
}