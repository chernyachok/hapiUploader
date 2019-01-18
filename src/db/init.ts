import Sequelize from 'sequelize';
import { RESOLVER, AwilixContainer, asValue } from 'awilix';
import { ServerConfigurations } from '../configurations';

export async function initDb(container: AwilixContainer) {
        const { dbUri } = container.resolve<ServerConfigurations>('serverConfigs');
        const dbConnection = new Sequelize(dbUri, {
            define: {
                freezeTableName: true,
                timestamps: false
            },
            logging: false
        });
        await dbConnection.authenticate();
        container.register({
            dbConn: asValue(dbConnection)
        });
}

initDb[RESOLVER] = {};