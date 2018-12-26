import { init as initServer } from './initServer';
import { init as initDb } from '../db/init';
import { ServerConfigurations } from '../configurations';

export default async function start(serverConfigs: ServerConfigurations): Promise<void> {
    try {
        const dbConnection = await initDb(serverConfigs); 
        const server = await initServer(serverConfigs, dbConnection);
        await server.start();
        console.log(`server start at ${server.info.uri}`);
        console.log('Connection to the database has been established successfully.');
    } catch (err) {
        console.log('cant launch the server or database', err);
        process.exit(1);
    }
}