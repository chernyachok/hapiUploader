import createFileModel from '../db/models/file';
import FileController from './controller';
import initRoutes from './routes';
import { Server } from '../types/server';
import { UserModel } from '../types/userModel';

export default async function init(server: Server, pathToImgs: string, userModel: UserModel): Promise<boolean> {
    const fileModel = await createFileModel(server.db());
    const fileController = new FileController(fileModel, userModel, pathToImgs);
    server.bind(fileController);
    await initRoutes(server, fileController, pathToImgs);

    return true;
}