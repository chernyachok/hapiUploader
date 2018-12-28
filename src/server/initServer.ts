import * as Hapi from 'hapi';
import { Server } from '../types/server';
import { ServerConfigurations } from "../configurations";
import config from '../configurations/config.dev.json';
import { PluginConstructor } from '../types/plugin';
import { Models } from '../db';


export async function init({ port, host }: ServerConfigurations, modelList: Models): Promise<Server> {
    const server = new Hapi.Server({
        port,
        host,
        routes: {
            files: {
                relativeTo : process.cwd() + config.server.uploadDir
            }
        }
    }) as Server;

    const pluginPromises: Array<Promise<void>> = [];
    const apiPromises: Array<Promise<void>> = [];
    const { plugins, api } = config.server;

    plugins.forEach((pluginName: string) => {
        const Plugin: PluginConstructor = require('../plugins/' + pluginName);
        const plugin = new Plugin();
        pluginPromises.push(plugin.register(server, { serverConfigs, modelList }));
    });

    await Promise.all(pluginPromises);
    
    api.forEach((apiName: string) => {
        const initApi = require('../api/' + apiName);
        apiPromises.push(initApi(server, { serverConfigs, userModel }));
    });

    await Promise.all(apiPromises);

    return server;
}