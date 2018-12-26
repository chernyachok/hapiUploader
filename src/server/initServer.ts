import * as Hapi from 'hapi';
import * as inert from 'inert';
import { Server, InitServer } from '../types/server';
import { boomPlugin } from '../plugins/boom';
import { createSequelizePlugin } from '../plugins/sequelize';
import { ServerConfigurations } from "../configurations";
import createUserModel from '../db/models/user'; 
import config from '../configurations/config.dev.json';

export async function init(serverConfigs: ServerConfigurations): Promise<InitServer> {
    const { port, host } = serverConfigs;
    const server = new Hapi.Server({
        port,
        host,
        routes: {
            files: {
                relativeTo : process.cwd() + config.server.uploadDir
            }
        }
    }) as Server;

    await server.register([{
        plugin: inert
    }, {
        plugin: boomPlugin
    }, {
        plugin: createSequelizePlugin(serverConfigs)
    }]);

    const userModel = await createUserModel(server.db());

    const pluginPromises: Array<Promise<void>> = [];

    config.server.plugins.forEach((pluginName: string) => {
        const Plugin = require('../plugins/' + pluginName);
        const plugin = new Plugin();
        pluginPromises.push(plugin.register(server, { serverConfigs, userModel }));
    });

    await Promise.all(pluginPromises);
    
    return { server, userModel };
}