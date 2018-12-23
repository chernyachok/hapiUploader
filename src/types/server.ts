import { Server as HapiServer } from 'hapi';
import { Sequelize } from 'sequelize';
import { UserModel } from './userModel';

export interface Server extends HapiServer {
    db?: () => Sequelize;
}

export interface InitServer {
    server: Server;
    userModel: UserModel;
}