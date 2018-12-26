import Sequelize from 'sequelize';
import { UserInstance, UserAttributes } from '../../types/userModel';

export default async function createUserModel(connection: Sequelize.Sequelize): Promise<any> {

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
        }
    });
    await userModel.sync();
    return userModel;
}