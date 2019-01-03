import * as Hapi from 'hapi';
import { Server, PluginConstructor } from '../types';
import { ServerConfigurations } from "../configurations";
import { Models } from '../db/types';


export async function init(serverConfigs: ServerConfigurations, modelList: Models): Promise<Server> {
    const { port, host } = serverConfigs;
    const server = new Hapi.Server({
        port,
        host,
        routes: {
            files: {
                relativeTo : process.cwd() + 'public'
            }
        }
    }) as Server;

    const { plugins, api } = serverConfigs;

    const pluginPromises: Array<Promise<void>> = plugins.map((pluginName: string) => {
        const Plugin: PluginConstructor = require('../plugins/' + pluginName).default;
        const plugin = new Plugin();
        return plugin.register(server, { serverConfigs, modelList });
    });

    await Promise.all(pluginPromises);
    
    const apiPromises: Array<Promise<void>> = api.map((apiName: string) => {
        const initApi = require('../api/' + apiName).default;
        return initApi(server, { serverConfigs, modelList });
    });

    await Promise.all(apiPromises);

    return server;
}