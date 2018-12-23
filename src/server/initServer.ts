import * as Hapi from 'hapi';
import * as inert from 'inert';
import { Server } from '../types/server';
import { boomPlugin } from '../plugins/boom';
import { createSequelizePlugin } from '../plugins/sequelize';
import createJwtPlugin from '../plugins/jwt-auth';
import { ServerConfigurations } from "../configurations";

export default async function initServer(serverConfigs: ServerConfigurations): Promise<Server> {
    const { port, host } = serverConfigs;
    const server = new Hapi.Server({
        port,
        host,
        routes: {
            files: {
                relativeTo : (process.cwd() + '/public')
            }
        }
    });
    
    await server.register([{
        plugin: inert
    }, {
        plugin: boomPlugin
    }, {
        plugin: createSequelizePlugin(serverConfigs)
    }]);
    await createJwtPlugin(server, serverConfigs);
    return server;
}