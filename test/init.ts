import * as path from 'path';
import dotenv from 'dotenv';
dotenv.config({path: path.join(process.cwd(), '.env.test')});

import { initServer } from '../src/server/configureServer';
import { initDb } from '../src/db/init';
import { initModels } from '../src/db';
import { ServerConfigurations } from '../src/configurations';
import { configureContainer } from '../src/diContainer';
import { Server } from '../src/types/server';
import { Sequelize } from 'sequelize';

interface InitResult {
    server: Server;
    serverConfigs: ServerConfigurations;
    dbConn: Sequelize;
}

let server: Server;

export default async function init(useCachedVersion = true): Promise<InitResult> {
    try {
       
        const container = await configureContainer();
        await initDb(container);
        await initModels(container);

        let serverConfigs = container.resolve<ServerConfigurations>('serverConfigs');
        let dbConn = container.resolve<Sequelize>('dbConn');

        if (useCachedVersion && server) {
            return { 
                server,
                serverConfigs, 
                dbConn
            }; 
        }

        server = await initServer(container);
        await server.start();
        console.log('server started at', server.info.uri);

        return { 
            server,
            serverConfigs, 
            dbConn
        }; 
    } catch (err) {
        console.log('cant launch server or db', err);
        throw err;
    }
}