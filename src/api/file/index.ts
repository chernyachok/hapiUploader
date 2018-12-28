import FileController from './controller';
import initRoutes from './routes';
import { Server } from '../../types/server';
import { ApiEnterOptions } from '../../types/common';

export default async function init(
    server: Server,
    {
        serverConfigs,
        modelList: { fileModel }
    }: ApiEnterOptions
): Promise<boolean> {
    const fileController = new FileController(fileModel, serverConfigs);
    server.bind(fileController);
    await initRoutes(server, serverConfigs, fileController);

    return true;
}