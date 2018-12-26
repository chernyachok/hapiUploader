import createFileModel from './dbModel';
import FileController from './controller';
import initRoutes from './routes';
import { Server } from '../../types/server';
import { ApiEnterOptions } from '../../types/common';

export default async function init(
    server: Server,
    {
        serverConfigs,
        dbConnection
    }: ApiEnterOptions
): Promise<boolean> {
    const fileModel = await createFileModel(dbConnection);
    const fileController = new FileController(fileModel, serverConfigs);
    server.bind(fileController);
    await initRoutes(server, serverConfigs, fileController);

    return true;
}