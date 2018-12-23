import * as Hapi from 'hapi';
import * as inert from 'inert';
import { Server, InitServer } from '../types/server';
import { boomPlugin } from '../plugins/boom';
import { createSequelizePlugin } from '../plugins/sequelize';
import createJwtPlugin from '../plugins/jwt-auth';
import { ServerConfigurations } from "../configurations";
import createUserModel from '../db/models/user'; 

export default async function initServer(serverConfigs: ServerConfigurations): Promise<InitServer> {
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
    const serverDb = (server as Server).db();
    const userModel = await createUserModel(serverDb);
    await createJwtPlugin(server, serverConfigs, userModel);
    return { server, userModel };
}