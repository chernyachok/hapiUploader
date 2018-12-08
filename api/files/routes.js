const validator = require('./validator');
const fileController = require('./controller');

module.exports = async (server) => {

    server.route({
        method: 'GET',
        path: '/files',
        options: {
            description: 'outputs all files previously uploaded',
            handler: fileController.getListOfFiles
        }

    })

    server.route({
        method: 'DELETE',
        path: '/files',
        options: {
            handler: fileController.fileDelete,
            validate: {
                payload: validator.deleteValidator
            }
        }
    })

    server.route({
        method: 'POST',
        path: '/files',
        options: {
            handler: fileController.fileUpload,
            payload: {
                output: 'stream',
            },
        }
    })

    server.route({
        method: 'GET',
        path: '/{not_found*}',
        handler: (req, h) => {
            return h.file('404.html')
        }
    })
}
