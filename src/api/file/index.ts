import FileDal from './fileDAL';
import initRoutes from './routes';
import { Server } from '../../types';
import { ApiEnterOptions } from '../../types';
import FileController from './controller';

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