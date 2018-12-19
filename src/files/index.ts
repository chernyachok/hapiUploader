import File from '../db/models/file';
import FileController from './controller';
import initRoutes from './routes';
import { Server } from '../types/server';

export default async function(server: Server, pathToImgs: string): Promise<boolean> {
    const fileModel = await File(server.db);
    const fileController = new FileController(fileModel, pathToImgs);
    server.bind(fileController);
    await initRoutes(server, fileController, pathToImgs);

    return true;
}