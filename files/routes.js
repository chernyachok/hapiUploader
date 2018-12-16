const validator = require('./validator');
const config = require('../configurations/config.dev.json');
const path = require('path');

module.exports = async (server, fileController, staticF) => {

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
            handler: fileController.getListOfFiles
        }
    })

    server.route({
        method: 'GET',
        path: '/files/{filename}',
        handler: {
            directory: {
                path: path.join(process.cwd(), 'public', `${staticF}`)
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
        path: '/files',
        options: {
            handler: fileController.uploadFile,
            payload: {
                output: 'stream',
                allow: "multipart/form-data",
                maxBytes: config.server.fileMaxSize
            },
            validate: {
                payload: validator.uploadFileValidator
            }
        }
    })

    server.route({
        method: 'GET',
        path: '/{not_found*}',
        handler: (req, h) => {
            return h.notFound('Sorry.');
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