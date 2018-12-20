import * as path from 'path';
const dotenv = require('dotenv');
dotenv.config({path: path.join(process.cwd(), '.env.test')});

const initServer = require('../server/initServer');
const initApi = require('../files');
const { workingUrl } = require('../files/utils');

const { getServerConfigs } = require('../configurations');

const start = async () => {
    try {
        const serverConfigs = getServerConfigs();
        const server = await initServer(serverConfigs);
        await initApi(server, serverConfigs.pathToImgs);
        await server.start();
        const url = workingUrl();
        console.log('server started at', server.info.uri);
        console.log('Connection to the database has been established successfully.');
        return { server, url, connectionDb: server.db }; 
    } catch (err) {
        console.log('cant launch server or db', err);
        process.exit(1);
    }
}

module.exports = start;