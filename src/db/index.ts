import { readdirSync } from 'fs';
import path from 'path';
import { RESOLVER, AwilixContainer, asValue } from 'awilix';

const getModels = () => {
    const res = readdirSync(path.join(__dirname, 'models'));
    return res.map((modelName: string) => modelName.split('.')[0]);
};

export const initModels = async (container: AwilixContainer) => {
    const modelPromises = getModels().map(async (modelName: string) => {
        const createModel = require('./models/' + modelName).default;
        const model = await createModel(container.resolve('dbConn'));
        container.register({
            [modelName]: asValue(model)
        });
    });

    await Promise.all(modelPromises);
};

initModels[RESOLVER] = {};