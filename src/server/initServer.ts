import * as Hapi from 'hapi';
import { Server } from '../types/server';
import { ServerConfigurations } from "../configurations";
import createUserModel from '../api/user/dbModel'; 
import config from '../configurations/config.dev.json';
import { Sequelize } from 'sequelize';
import { PluginConstructor } from '../types/plugin';



export async function init(serverConfigs: ServerConfigurations, dbConnection: Sequelize): Promise<Server> {
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

    const userModel = await createUserModel(dbConnection);

    const pluginPromises: Array<Promise<void>> = [];
    const apiPromises: Array<Promise<void>> = [];
    const { plugins, api } = config.server;

    plugins.forEach((pluginName: string) => {
        const Plugin: PluginConstructor = require('../plugins/' + pluginName);
        const plugin = new Plugin();
        pluginPromises.push(plugin.register(server, { serverConfigs, userModel }));
    });

    await Promise.all(pluginPromises);
    
    api.forEach((apiName: string) => {
        const initApi = require('../api/' + apiName);
        apiPromises.push(initApi(server, { serverConfigs, userModel, dbConnection }));
    });

    await Promise.all(apiPromises);

    return server;
}