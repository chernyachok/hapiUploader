import { Model, Instance } from 'sequelize';

type InstanceExt<T> = {
    dataValues: T;
};

type UserInstance = Instance<UserAttributes> & UserAttributes & InstanceExt<UserAttributes>;

export type UserModel = Model<UserInstance, UserAttributes>;

interface UserAttributes {
    id?: number;
    username: string;
}

type FileInstance = Instance<FileAttributes> & FileAttributes & InstanceExt<FileAttributes>;

export type FileModel = Model<FileInstance, FileAttributes>;

interface FileAttributes {
    id?: number;
    filename: string;
    url: string;
}

export interface Models {
    userModel?: UserModel;
    fileModel?: FileModel;
}
