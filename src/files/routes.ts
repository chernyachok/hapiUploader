import {
    logoModel,
    jobModel,
    deleteValidator,
    updateValidator
} from './validator';
import config from '../configurations/config.dev.json';
import * as Path from 'path';
import { handleFileValidation, getImageAllowedFormats, getDocsAllowedFormats } from './utils';
import { Server } from '../types/server';
import FileController from './controller';
import { Request } from '../types/request';
import { Response } from '../types/response';

export default async function(server: Server, fileController: FileController, staticFolder: string) {

    server.route({
        method: 'GET',
        path: '/main',
        handler: fileController.getViewOfListOfFiles
    });

    server.route({
        method: 'GET',
        path: '/files',
        options: {
            description: 'outputs all files previously uploaded',
            handler: fileController.getListOfFiles,
        }
    });

    server.route({
        method: 'GET',
        path: '/files/{filename}',
        handler: {
            directory: {
                path: Path.join(process.cwd(), 'public', `${staticFolder}`)
            }
        }
    });

    server.route({
        method: 'PUT',
        path: '/files',
        options: {
            handler: fileController.updateFile,
            validate: {
                payload: updateValidator
            }
        }
    });

    server.route({
        method: 'DELETE',
        path: '/files',
        options: {
            handler: fileController.deleteFile,
            validate: {
                payload: deleteValidator
            }
        }
    });

    server.route({
        method: 'POST',
        path: '/users/logo',
        options: {
            pre: [
                {
                    assign: 'file',
                    method: handleFileValidation('logo', getImageAllowedFormats())
                }
            ],
            handler: fileController.saveLogo,
            payload: {
                output: 'stream',
                allow: "multipart/form-data",
                maxBytes: config.server.fileMaxSize
            },
            validate: {
                payload: logoModel
            }
        }
    });

    server.route({
        method: 'POST',
        path: '/users/jobs',
        options: {
            pre: [
                {
                    assign: 'file',
                    method: handleFileValidation('file', getDocsAllowedFormats())
                }
            ],
            handler: fileController.saveJob,
            payload: {
                output: 'stream',
                allow: "multipart/form-data",
                maxBytes: config.server.fileMaxSize
            },
            validate: {
                payload: jobModel
            }
        }
    });

    server.route({
        method: 'GET',
        path: '/{not_found*}',
        handler: (req: Request, h: Response) => {
            return h.notFound('sorry');
        }
    });

    server.ext('onRequest', (req, h) => {
        let { path } = req.url;
        if (path.slice(-1) === '/') {
            return h.redirect(path.slice(0, -1)).code(301).takeover();
        }
        return h.continue;
    });
}