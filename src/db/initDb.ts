import * as SequelizeConn from 'sequelize';
import { Sequelize } from 'sequelize';
import { ServerConfigurations } from '../configurations';

export default async function(serverConfigs: ServerConfigurations): Promise<Sequelize> {
    const { dbName, dbUser, dbUserPass, dbDialect } = serverConfigs;
        const connection = new SequelizeConn(dbName, dbUser, dbUserPass, {
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