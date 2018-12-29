import Sequelize from 'sequelize';
import { FileInstance, FileAttributes } from '../types';

export default async function createFileModel(connection: Sequelize.Sequelize): Promise<any> {

    const fileModel = connection.define<FileInstance, FileAttributes>('files', {
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
    await fileModel.sync();
    return fileModel;
}