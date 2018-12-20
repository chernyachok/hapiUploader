import * as Sequelize from 'sequelize';
// import { SequelizeModel } from '../../types/model';

export default async function(connection: Sequelize.Sequelize): Promise<any>{
    const file = connection.define('files', {
        id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        filename: {
            type: Sequelize.STRING,
            allowNull: false
        },
        url: {
            type: Sequelize.STRING,
            allowNull: false
        }
    });
    await file.sync();
    return file;
}
