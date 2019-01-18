import Sequelize from 'sequelize';
import { UserInstance, UserAttributes } from '../types';

export default async function createUserModel(dbConn: Sequelize.Sequelize) {

    const userModel = dbConn.define<UserInstance, UserAttributes>('users', {
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