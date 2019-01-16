import { Sequelize, Model } from 'sequelize';
import { readdirSync } from 'fs';
import path from 'path';
import { Models } from './types';
import { RESOLVER } from 'awilix';

type ModelObj = [string, Model<any, any>];

const getModels = () => {
    const res = readdirSync(path.join(__dirname, 'models'));
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
        const model = require('./models/' + modelName).default;
        const modelObj = await model(dbConn);

        return [modelName, modelObj];
    });

    const resolvedModels = await Promise.all(modelPromises);
    return convertArrToObj(resolvedModels);
};

initModels[RESOLVER] = {};