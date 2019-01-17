import { 
    createContainer,
    asClass,
    asFunction,
    asValue,
}
from 'awilix';
import { getServerConfigs, ServerConfigurations } from './configurations';
import { initDb } from './db/init';
import { initModels } from './db';

export const configureContainer = async () => {
    const initContainer = createContainer({
        injectionMode: 'CLASSIC'
    });
    initContainer.loadModules([
        ['db/**/*.js', {
            register: asFunction
        }],
        ['plugins/**/*.js', {
            register: asClass
        }],
        ['server/**/*.js', {
            register: asFunction
        }],
        ['api/**/+(controller|dal|apiController|apiDal|fileSystem).js', {
            register: asClass
        }],
        ['api/**/!(controller|dal|apiController|apiDal|fileSystem).js', {
            register: asFunction
        }]
    ], {
        cwd: __dirname,
        formatName: 'camelCase',
        resolverOptions: {
            lifetime: 'SINGLETON'
        }
    }).register({
        serverConfigs: asFunction(getServerConfigs).singleton()
    });
    const dbConn = await initDb(initContainer.resolve<ServerConfigurations>('serverConfigs'));
    const modelList = await initModels(dbConn);

    initContainer.register({
        modelList: asValue(modelList)
    });

    return initContainer;
};
