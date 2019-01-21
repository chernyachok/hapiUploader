import * as path from 'path';
import {
    logoModel,
    jobModel,
    deleteValidator,
    updateValidator,
} from './fileValidator';
import { jwtValidator } from '../../utils/validation';
import { handleFileValidation, getImageAllowedFormats, getDocsAllowedFormats } from '../../utils/file';
import { Server } from '../../types/server';
import { Request } from '../../types/request';
import { Response } from '../../types/response';
import { ServerConfigurations } from '../../configurations';
import FileDal from './fileDal';

export default async function init(server: Server, serverConfigs: ServerConfigurations, fileDal: FileDal) {
    server.bind(fileDal);

    server.route({
        method: 'GET',
        path: '/main',
        options: {
            auth: 'jwt',
            handler: fileDal.getViewOfListOfFiles
        }
    });

    server.route({
        method: 'GET',
        path: '/files',
        options: {
            auth: 'jwt',
            handler: fileDal.getListOfFiles,
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
                    path: path.join(process.cwd(), serverConfigs.uploadDir)
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
            handler: fileDal.updateFile,
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
            handler: fileDal.deleteFile,
            validate: {
                headers: jwtValidator,
                payload: deleteValidator
            },
            description: 'deletes a certain file'
        }
    });

    server.route({
        method: 'POST',
        path: '/files/logo',
        options: {
            auth: 'jwt',
            pre: [
                {
                    assign: 'file',
                    method: handleFileValidation('logo', getImageAllowedFormats(serverConfigs.fileWhiteList))
                }
            ],
            handler: fileDal.saveLogo,
            payload: {
                output: 'stream',
                allow: "multipart/form-data",
                maxBytes: serverConfigs.fileMaxSize
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
        path: '/files/jobs',
        options: {
            auth: 'jwt',
            pre: [
                {
                    assign: 'file',
                    method: handleFileValidation('file', getDocsAllowedFormats(serverConfigs.fileWhiteList))
                }
            ],
            handler: fileDal.saveJob,
            payload: {
                output: 'stream',
                allow: "multipart/form-data",
                maxBytes: serverConfigs.fileMaxSize
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