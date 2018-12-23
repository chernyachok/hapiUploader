import initServer from './initServer';
import initApi from '../files';
import { ServerConfigurations } from '../configurations';

export default async function startServer(serverConfigs: ServerConfigurations): Promise<void> {
    try {
        const { server, userModel } = await initServer(serverConfigs);
        await initApi(server, serverConfigs.pathToImgs, userModel);
        await server.start();
        console.log(`server start at ${server.info.uri}`);
        console.log('Connection to the database has been established successfully.');
    } catch (err) {
        console.log('cant launch the server or database', err);
        process.exit(1);
    }
}