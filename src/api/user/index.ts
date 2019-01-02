import initRoutes from './routes';
import { Server } from '../../types/server';
import UserController from './controller';
import UserDal from './userDAL';
import { ApiEnterOptions } from '../../types/common';

export default async function init(
    server: Server,
    {
        serverConfigs,
        modelList: { userModel }
    }: ApiEnterOptions
): Promise<boolean> {
    const userController = new UserController(userModel, serverConfigs);
    const userDal = new UserDal(userController);
    server.bind(userController);
    await initRoutes(server, serverConfigs, userController);

    return true;
}