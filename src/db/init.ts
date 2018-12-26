import Sequelize from 'sequelize';
import { ServerConfigurations } from '../configurations';

export async function init(serverConfigs: ServerConfigurations): Promise<Sequelize.Sequelize> {
    const { dbName, dbUser, dbUserPass, dbDialect } = serverConfigs;
        const dbConnection = new Sequelize(dbName, dbUser, dbUserPass, {
            dialect: dbDialect,
            define: {
                freezeTableName: true,
                timestamps: false
            },
            logging: false
        });
        await dbConnection.authenticate();
        return dbConnection;
}