const Hapi = require('hapi');
const inert = require('inert');
const path = require('path');
const joi = require('joi');
const handleFileUpload = require('./handleFileUpload');

const server = Hapi.server({
    port: 3000,
    host: 'localhost',
    routes: {
        files: {
            relativeTo: path.join(__dirname, 'public')
        }
    }
});

server.route({
    method: 'GET',
    path: '/get_list_of_files',
    options: {
        description: 'outputs all files previously uploaded',
        handler: (req, h) => {
            let listOffileNames = '';
            list.files.forEach(item => {
                listOffileNames += (item.src + '<br/>')
            });
            return h.response(listOffileNames).type('text/html');
        }
    }

})

server.route({
    method: 'POST',
    path: '/files',
    options: {
        handler: async (req, h) => {
            const { file } = req.payload;
            const response = await handleFileUpload(file)
            return h.response(response);
        },
        payload: {
            output: 'stream',
        }
    }
})

server.route({
    method: 'GET',
    path: '/{not_found*}',
    handler: (req, h) => {
        return h.file('404.html')
    }
})

const init = async () => {
    await server.register({
        plugin: inert,
        options: {

        }
    });
    await server.start()
    console.log(`server start at ${server.info.uri}`);
}

init()