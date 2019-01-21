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
        ['api/**/+(*Controller|*Dal).js', { /// <- TO BE FIXED
            register: asClass
        }],
        ['api/**/+(*Routes|*Routes).js', {
            register: asFunction
        }]
    ], {
        cwd: process.cwd() + '/build',
        formatName: 'camelCase',
        resolverOptions: {
            lifetime: 'SINGLETON'
        }
    }).register({
        serverConfigs: asFunction(getServerConfigs).singleton()
    });
    // console.log(Object.getOwnPropertyNames(initContainer.cradle))
   
    return initContainer;
};
