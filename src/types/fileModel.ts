import { Model, Instance } from 'sequelize';

export type InstanceExt<T> = {
    dataValues: T;
};

export type FileInstance = Instance<FileAttributes> & FileAttributes & InstanceExt<FileAttributes>;

export type FileModel = Model<FileInstance, FileAttributes>;

export interface FileAttributes {
    id?: number;
    filename: string;
    url: string;
}