import { Server as HapiServer } from 'hapi';
import { Sequelize } from 'sequelize';
import { Response } from './response';

export interface Server extends HapiServer {
    db?: () => Sequelize;
    boom(): Response;
}

