import nconf from 'nconf';
import * as path from 'path';
import { RESOLVER } from 'awilix';

const envMode = process.env.NODE_ENV;

nconf
    .argv()
    .env()
    .file({ file: path.join(__dirname, `config.${envMode}.json`)});

export interface ServerConfigurations {
    port: number;
    host: string;
    jwtSecret: string;
    jwtExpiration: string;
    routes: Array<string>;
    fileMaxSize: number;
    fileWhiteList: Array<string>;
    uploadDir: string;
    dbUri: string;
}

export function getServerConfigs(): ServerConfigurations {
    return Object.assign(
        {},
        nconf.get('server'),
        {
            port: nconf.get('API_PORT'),
            host: nconf.get('API_HOST'),
            dbUri: nconf.get('DB_URI'),
            jwtSecret: nconf.get('JWT_SECRET'),
            jwtExpiration: nconf.get('JWT_EXPIRATION')
        }
    );
}

getServerConfigs[RESOLVER] = {};