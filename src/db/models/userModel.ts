import Sequelize from 'sequelize';
import { UserInstance, UserAttributes } from '../types';

export default async function createUserModel(connection: Sequelize.Sequelize) {

    const userModel = connection.define<UserInstance, UserAttributes>('users', {
        id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        username: {
            type: Sequelize.STRING,
            allowNull: false
        },
        password: {
            type: Sequelize.STRING(10),
            allowNull: false
        }
    });
    await userModel.sync();
    return userModel;
}