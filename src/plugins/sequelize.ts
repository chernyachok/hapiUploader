import initDb from '../db/initDb';

export const createSequelizePlugin = (serverConfigs) => ({
    name: 'Sequelize',
    version: '1.1.0',
    register: async function (server, options) {
        const connectionDb = await initDb(serverConfigs);
        
        server.decorate('server', 'db', connectionDb);
    }
})