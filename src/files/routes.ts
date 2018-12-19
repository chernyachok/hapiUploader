const validator = require('./validator');
const config = require('../configurations/config.dev.json');
const path = require('path');
const { handleFileValidation, getImageAllowedFormats, getDocsAllowedFormats } = require('./utils');

export default async function(server, fileController, staticFolder) {

    server.route({
        method: 'GET',
        path: '/main',
        handler: fileController.getViewOfListOfFiles
    })

    server.route({
        method: 'GET',
        path: '/files',
        options: {
            description: 'outputs all files previously uploaded',
            handler: fileController.getListOfFiles,
        }
    })

    server.route({
        method: 'GET',
        path: '/files/{filename}',
        handler: {
            directory: {
                path: path.join(process.cwd(), 'public', `${staticFolder}`)
            }
        }
    })

    server.route({
        method: 'PUT',
        path: '/files',
        options: {
            handler: fileController.updateFile,
            validate: {
                payload: validator.updateValidator
            }
        }
    })

    server.route({
        method: 'DELETE',
        path: '/files',
        options: {
            handler: fileController.deleteFile,
            validate: {
                payload: validator.deleteValidator
            }
        }
    })

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
                payload: validator.logoModel
            }
        }
    })

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
                payload: validator.jobModel
            }
        }
    })

    server.route({
        method: 'GET',
        path: '/{not_found*}',
        handler: (req, h) => {
            return h.db.findOne({where: { id: 1}});
        }
    })

    server.ext('onRequest', (req, h) => {
        let { path } = req.url;
        if(path.slice(-1) === '/'){
            return h.redirect(path.slice(0, -1)).code(301).takeover();
        }
        return h.continue;
    })
}