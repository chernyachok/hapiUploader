import * as Hapi from 'hapi';
import { Server } from '../types';
import { ServerConfigurations } from "../configurations";
import { RESOLVER, AwilixContainer, asValue } from 'awilix';

export async function initServer(container: AwilixContainer) {
    const { port, host, plugins, api } = container.resolve<ServerConfigurations>('serverConfigs');
    const server = new Hapi.Server({
        port,
        host,
        routes: {
            files: {
                relativeTo : process.cwd() + 'public'
            }
        }
    }) as Server;

    await container.register({
        server: asValue(server)
    });

    const pluginPromises: Array<Promise<void>> = plugins.map(async (pluginName: string) => 
         container.resolve<any>(pluginName).register());

    await Promise.all(pluginPromises);
    
    const apiPromises: Array<Promise<void>> = api.map(async (apiName: string) => 
        container.resolve<any>(apiName));

    await Promise.all(apiPromises);
}

initServer[RESOLVER] = {};