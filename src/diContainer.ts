import { 
    createContainer,
    asClass,
    asFunction,
}
from 'awilix';
import { getServerConfigs } from './configurations';

export const configureContainer = async () => {
    const initContainer = createContainer({
        injectionMode: 'CLASSIC'
    });
    initContainer.loadModules([
        ['db/models/**/*.js', {
            register: asFunction
        }],
        ['plugins/**/*.js', {
            register: asClass
        }],
        ['server/**/*.js', {
            register: asFunction
        }],
        ['api/**/+(fileController|userController|fileDal|userDal|apiController|apiDal).js', { /// <- TO BE FIXED
            register: asClass
        }],
        ['api/**/+(fileRoutes|userRoutes).js', {
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

    return initContainer;
};
