import { Sequelize, Model } from 'sequelize';
import { readdirSync } from 'fs';
import path from 'path';
import { UserModel } from '../types/userModel';
import { FileModel } from '../types/fileModel';

export interface Models {
    userModel?: UserModel;
    fileModel?: FileModel;
}

type ModelObj = [string, Model<any, any>];

const getModels = () => {
    const res = readdirSync(path.join(process.cwd(), 'db/models'));
    return res.map((modelName: string) => modelName.split('.')[0]);
};

const convertArrToObj = (resolvedModels: Array<ModelObj>) => {
    return resolvedModels.reduce((acc, [modelName, modelObj]) => {
        acc[modelName] = modelObj;

        return acc;
    }, {});
};

export const initModels = async (dbConn: Sequelize): Promise<Models> => {
    const modelPromises = getModels().map(async (modelName: string): Promise<ModelObj> => {
        const model = require('./models/' + modelName);
        const modelObj = await model(dbConn);

        return [modelName, modelObj];
    });

    const resolvedModels = await Promise.all(modelPromises);
    return convertArrToObj(resolvedModels);
};