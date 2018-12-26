import {
    logoModel,
    jobModel,
    deleteValidator,
    updateValidator,
    jwtValidator
} from './validator';
import config from '../../configurations/config.dev.json';
import * as path from 'path';
import { handleFileValidation, getImageAllowedFormats, getDocsAllowedFormats } from './utils';
import { Server } from '../../types/server';
import FileController from './controller';
import { Request } from '../../types/request';
import { Response } from '../../types/response';
import { ServerConfigurations } from '../../configurations';

export default async function(server: Server, configs: ServerConfigurations, fileController: FileController) {

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
                    path: path.join(process.cwd(), 'public', configs.pathToImgs)
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
                    method: handleFileValidation('logo', getImageAllowedFormats(config.server.fileWhiteList))
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
                    method: handleFileValidation('file', getDocsAllowedFormats(config.server.fileWhiteList))
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

    server.ext('onRequest', (req: Request, h: Response) => {
        let { path: urlPath } = req.url;
        if (urlPath.slice(-1) === '/') {
            return h.redirect(urlPath.slice(0, -1)).code(301).takeover();
        }
        return h.continue;
    });
}