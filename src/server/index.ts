import { init as initServer } from './initServer';
import { ServerConfigurations } from '../configurations';
import { init as initDb} from '../db/init';
import { initModels } from '../db';

export default async function start(serverConfigs: ServerConfigurations): Promise<void> {
    try {
        const dbConn = await initDb(serverConfigs);
        const modelList = await initModels(dbConn);
        const server = await initServer(serverConfigs, modelList);
        await server.start();
        console.log(`server start at ${server.info.uri}`);
        console.log('Connection to the database has been established successfully.');
    } catch (err) {
        console.log('cant launch the server or database', err);
        process.exit(1);
    }
}