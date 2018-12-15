const validator = require('./validator');
const config = require('../configurations/config.dev.json');
const path = require('path');

const publicImgsPath = path.join(process.cwd(), 'public', 'imgs');

module.exports = async (server, fileController) => {

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
                path: publicImgsPath
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
            return h.file('404.html');
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