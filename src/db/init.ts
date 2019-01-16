import Sequelize from 'sequelize';
import { ServerConfigurations } from '../configurations';
import { RESOLVER } from 'awilix';

export async function initDb(serverConfigs: ServerConfigurations): Promise<Sequelize.Sequelize> {
        const dbConnection = new Sequelize(serverConfigs.dbUri, {
            define: {
                freezeTableName: true,
                timestamps: false
            },
            logging: false
        });
        await dbConnection.authenticate();
        return dbConnection;
}

initDb[RESOLVER] = {};