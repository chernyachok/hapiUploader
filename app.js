const Hapi = require('hapi');
const inert = require('inert');
const path = require('path');
const joi = require('joi');
const fs = require('fs');
var list = require('./list.json');

const server = Hapi.server({
    port: 3000,
    host: 'localhost',
    routes: {
        files: {
            relativeTo: path.join(__dirname, 'public')
        }
    }
});

const handleFileUpload = file => {
    return new Promise((resolve, reject) => {
        const fileName = file.hapi.filename;
        const data = file._data;
        const parsedList = { ...list };
        parsedList.files.forEach(item => {
            if(item.src === fileName){
                console.log('loop true')
                return resolve({message: 'such file exist'})
            }
        })
        console.log('continue');
        fs.writeFile(`./public/imgs/${fileName}`, data, err => {
            if (err) {
                reject(err)
            }

            parsedList.files.push({ id: new Date().getTime(), src: fileName });

            fs.writeFile('list.json', JSON.stringify(parsedList), (err) => {
                if (err) throw err
            })
            console.log('upl succes');
            resolve({ message: 'uploaded successfully' })
        })
    })
}

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
        handler: (req, h) => {
            const { file } = req.payload;

            const response = handleFileUpload(file)
            return response;
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