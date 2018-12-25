import * as path from 'path';
import dotenv from 'dotenv';
dotenv.config({path: path.join(process.cwd(), '.env.test')});

import initServer from '../src/server/initServer';
import initApi from '../src/files';
import { workingUrl } from '../src/files/utils';

import { getServerConfigs } from '../src/configurations';
import { Server } from '../src/types/server';
import { Sequelize } from 'sequelize';

interface InitResult {
    server: Server;
    url: string;
    connectionDb: Sequelize;
}

export default async function init(): Promise<InitResult> {
    try {
        const serverConfigs = getServerConfigs();
        const { server, userModel } = await initServer(serverConfigs);
        await initApi(server, serverConfigs.pathToImgs, userModel);
        await server.start();
        const url = workingUrl();
        console.log('server started at', server.info.uri);
        console.log('Connection to the database has been established successfully.');
        return { 
            server,
            url, 
            connectionDb: server.db()
        }; 
    } catch (err) {
        console.log('cant launch server or db', err);
        throw err;
    }
}