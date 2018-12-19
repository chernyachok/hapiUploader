import initServer from './initServer';
import initApi from '../files';
import { ServerConfigurations } from '../configurations';

export default async function (serverConfigs: ServerConfigurations) {
    try {
        const server = await initServer(serverConfigs);
        await initApi(server, serverConfigs.pathToImgs);
        await server.start();
        console.log(`server start at ${server.info.uri}`);
        console.log('Connection to the database has been established successfully.');
    } catch (err) {
        console.log('cant launch the server or database', err);
        process.exit(1);
    }
}