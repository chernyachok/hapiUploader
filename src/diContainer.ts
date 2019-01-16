import { 
    createContainer,
    asClass,
    asFunction,
}
from 'awilix';

const configureContainer = () => {
    const initContainer = createContainer({
        injectionMode: 'CLASSIC'
    });
    initContainer.loadModules([
        ['db/**/*.js', {
            lifetime: 'SINGLETON',
            register: asFunction
        }],
        ['plugins/**/*.js', {
            lifetime: 'SINGLETON',
            register: asClass
        }],
        ['server/**/*.js', {
            lifetime: 'SINGLETON',
            register: asFunction
        }],
        ['api/**/*.js', {
            lifetime: 'SINGLETON',
            register: asClass
        }],
        ['api/**/!(controller|dal|apiController|apiDal|fileSystem).js', {
            lifetime: 'SINGLETON',
            register: asFunction
        }],
        ['configurations/**/*.js', {
            lifetime: 'SINGLETON',
            register: asFunction
        }]
    ], {
        cwd: __dirname,
        formatName: 'camelCase'
    });

    return initContainer;
};

const container = configureContainer();
console.log(Object.getOwnPropertyNames(container.cradle));