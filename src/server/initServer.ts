import * as Hapi from 'hapi';
import * as inert from 'inert';

import { boomPlugin } from '../plugins/boom';
import { createSequelizePlugin } from '../plugins/sequelize';

export default async function (serverConfigs) {
    const { port, host } = serverConfigs;
    const server = Hapi.server({
        port,
        host,
        // router: {
        //     stripTrailingSlash: true
        // }
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

    return server;
}