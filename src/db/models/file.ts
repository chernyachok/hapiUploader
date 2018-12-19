import * as SequelizeTypes from 'sequelize';
import { Sequelize } from 'sequelize';
import { SequelizeModel } from '../../types/model';

export default async function(connection: Sequelize): Promise<SequelizeModel> {
    const File = connection.define('files', {
        id: {
            type: SequelizeTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        filename: {
            type: SequelizeTypes.STRING,
            allowNull: false
        },
        url: {
            type: SequelizeTypes.STRING,
            allowNull: false
        }
    });
    await File.sync();
    return File;
}
