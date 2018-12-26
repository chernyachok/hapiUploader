import {
    logoModel,
    jobModel,
    deleteValidator,
    updateValidator,
    jwtValidator,
    registerTokenValidator
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
        options: {
            auth: 'jwt',
            handler: fileController.getViewOfListOfFiles
        }
    });

    server.route({
        method: 'GET',
        path: '/auth/me',
        options: {
            auth: false,
            handler: fileController.getMe,
            validate: {
                headers: jwtValidator
            },
            description: 'Decode token',
        }
    });

    server.route({
        method: 'POST',
        path: '/auth/register',
        options: {
            auth: false,
            handler: fileController.registerToken,
            validate: {
                payload: registerTokenValidator
            },
            description: 'Encode payload into valid token',
        }
    });

    server.route({
        method: 'GET',
        path: '/files',
        options: {
            auth: 'jwt',
            handler: fileController.getListOfFiles,
            validate: {
                headers: jwtValidator
            },
            description: 'outputs all files previously uploaded',
        }
    });

    server.route({
        method: 'GET',
        path: '/files/{filename}',
        options: {
            auth: 'jwt',
            handler: {
                directory: {
                    path: Path.join(process.cwd(), 'public', `${staticFolder}`)
                }
            },
            validate: {
                headers: jwtValidator
            },
            description: 'Outputs a certain file',
        }
    });

    server.route({
        method: 'PUT',
        path: '/files',
        options: {
            auth: 'jwt',
            handler: fileController.updateFile,
            validate: {
                headers: jwtValidator,
                payload: updateValidator
            },
            description: 'Updates a certain file'
        }
    });

    server.route({
        method: 'DELETE',
        path: '/files',
        options: {
            auth: 'jwt',
            handler: fileController.deleteFile,
            validate: {
                headers: jwtValidator,
                payload: deleteValidator
            },
            description: 'deletes a certain file'
        }
    });

    server.route({
        method: 'POST',
        path: '/users/logo',
        options: {
            auth: 'jwt',
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
                headers: jwtValidator,
                payload: logoModel
            },
            description: 'Upload user avatar'
        }
    });

    server.route({
        method: 'POST',
        path: '/users/jobs',
        options: {
            auth: 'jwt',
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
                headers: jwtValidator,
                payload: jobModel
            },
            description: 'Save job .doc file'
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