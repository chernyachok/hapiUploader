import { readdirSync } from 'fs';
import path from 'path';
import { RESOLVER, AwilixContainer, asValue } from 'awilix';

export const getFolderFileNames = (folder: string) => {
    const res = readdirSync(folder);
    return res.filter(el => !el.endsWith('.map')).map((modelName: string) => modelName.split('.')[0]);
};

export const initModels = async (container: AwilixContainer) => {
    const modelPromises = getFolderFileNames(path.join(__dirname, 'models')).map(async (modelName: string) => {
        
        console.log(Object.getOwnPropertyNames(container.cradle));
        const model = await container.resolve(modelName);
        container.register({
            [modelName]: asValue(model)
        });
    });

    await Promise.all(modelPromises);
};

initModels[RESOLVER] = {};