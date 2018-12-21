import initDb from '../db/initDb';
import { ServerConfigurations } from '../configurations';
import { Server } from '../types/server';
import { PluginObject } from '../types/plugin';

export const createSequelizePlugin = (serverConfigs: ServerConfigurations): PluginObject => ({
    name: 'Sequelize',
    version: '1.1.0',
    register: async function (server: Server) {
        const connectionDb = await initDb(serverConfigs);
        server.decorate('server', 'db', () => connectionDb);
    }
});