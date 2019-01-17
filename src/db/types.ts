import { Model, Instance } from 'sequelize';

type InstanceExt<T> = {
    dataValues: T;
};

export type UserInstance = Instance<UserAttributes> & UserAttributes & InstanceExt<UserAttributes>;

export type UserModel = Model<UserInstance, UserAttributes>;

export interface UserAttributes {
    id?: number;
    username: string;
    password: string;
}

export type FileInstance = Instance<FileAttributes> & FileAttributes & InstanceExt<FileAttributes>;

export type FileModel = Model<FileInstance, FileAttributes> & {
    sync(): Promise<void>;
};

export interface FileAttributes {
    id?: number;
    filename: string;
    url: string;
}

export type Models = UserModel | FileModel;