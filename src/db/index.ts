import { Sequelize } from 'sequelize';
import { readdirSync } from 'fs';
import path from 'path';
import { UserModel } from '../types/userModel';
import { FileModel } from '../types/fileModel';

export interface Models {
    userModel?: UserModel;
    fileModel?: FileModel;
}

type ModelsArr = UserModel | FileModel;

type PromiseModels = Array<Promise<UserModel | FileModel>>;

export const initModels = async (dbConn: Sequelize) => {
    const modelNames: string[] = readdirSync(path.join(process.cwd(), 'db/models'), { encoding: 'utf8' });
    const modelPromises: PromiseModels = [];
    modelNames.forEach((modelName: string) => {
        const model = require('./models/' + modelName);
        modelPromises.push(model(dbConn));
    });

    let resolvedModels: Array<ModelsArr> = await Promise.all(modelPromises);
    const res: Models = resolvedModels.reduce((currentvalue: object, element: ModelsArr, index: number) => {
        currentvalue[modelNames[index]] = element;
        return currentvalue;
    }, {});

    return res;
};