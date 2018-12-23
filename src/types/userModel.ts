import { Model, Instance } from 'sequelize';

export type InstanceExt<T> = {
    dataValues: T;
};

export type UserInstance = Instance<UserAttributes> & UserAttributes & InstanceExt<UserAttributes>;

export type FileModel = Model<UserInstance, UserAttributes>;

export interface UserAttributes {
    id?: number;
    username: string;
}