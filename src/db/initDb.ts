import Sequelize from 'sequelize';
import { ServerConfigurations } from '../configurations';

export default async function initDb(serverConfigs: ServerConfigurations): Promise<Sequelize.Sequelize> {
    const { dbName, dbUser, dbUserPass, dbDialect } = serverConfigs;
        const connection = new Sequelize(dbName, dbUser, dbUserPass, {
            dialect: dbDialect,
            define: {
                freezeTableName: true,
                timestamps: false
            },
            logging: false
        });   
        await connection.authenticate();
        return connection;
}