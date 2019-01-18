import * as Hapi from 'hapi';
import * as path from 'path';
import { Server } from '../types';
import { ServerConfigurations } from "../configurations";
import { RESOLVER, AwilixContainer, asValue } from 'awilix';
import { getFolderFileNames } from '../db';

export async function initServer(container: AwilixContainer) {
    const { port, host, routes } = container.resolve<ServerConfigurations>('serverConfigs');
    
    const server = new Hapi.Server({
        port,
        host,
        routes: {
            files: {
                relativeTo : process.cwd() + 'public'
            }
        }
    }) as Server;

    container.register({
        server: asValue(server)
    });
    
    const pluginPromises: Array<Promise<void>> = getFolderFileNames(path.join(__dirname, '..', 'plugins')).map(async (pluginName: string) => 
        container.resolve<any>(pluginName).register()); // <--- .register(server)

    await Promise.all(pluginPromises);
    
    const routePromises: Array<Promise<void>> = routes.map(async (domainRouteName: string) => 
        container.resolve<any>(domainRouteName));

    await Promise.all(routePromises);

    return server;
}

initServer[RESOLVER] = {};