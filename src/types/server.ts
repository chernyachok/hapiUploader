import { Server as HapiServer } from 'hapi';
import { Sequelize } from 'sequelize';

export interface Server extends HapiServer{
    db?: Sequelize
}