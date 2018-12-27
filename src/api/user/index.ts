import initRoutes from './routes';
import { Server } from '../../types/server';
import UserController from './controller';
import { ApiEnterOptions } from '../../types/common';

export default async function init(
    server: Server,
    {
        serverConfigs,
        dbList,
    }: ApiEnterOptions
): Promise<boolean> {
    const uModel = dbList.get('uModel');
    const userController = new UserController(userModel, serverConfigs);
    server.bind(userController);
    await initRoutes(server, serverConfigs, userController);

    return true;
}