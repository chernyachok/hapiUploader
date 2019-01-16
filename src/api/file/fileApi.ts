import FileDal from './fileDal';
import initRoutes from './fileRoutes';
import { Server } from '../../types';
import { ApiEnterOptions } from '../../types';
import FileController from './fileController';

export default async function init(
    server: Server,
    {
        serverConfigs,
        modelList: { fileModel }
    }: ApiEnterOptions
): Promise<boolean> {
    const fileController = new FileController(fileModel, serverConfigs);
    const fileDal = new FileDal(fileController);
    server.bind(fileDal);
    await initRoutes(server, serverConfigs, fileDal);

    return true;
}