import { AwilixContainer } from 'awilix';
import { initModels } from '../db';
import { initDb } from '../db/init';
import { initServer } from './configureServer';

export default async function startServer(container: AwilixContainer) {
    try {
       
        await initDb(container);
        await initModels(container);
        const server = await initServer(container);
        
        await server.start();
        console.log(container.cradle);
        console.log(`server start at ${server.info.uri}`);
        console.log('Connection to the database has been established successfully.');
    } catch (err) {
        console.log('cant launch the server or database', err);
        process.exit(1);
    }
} 