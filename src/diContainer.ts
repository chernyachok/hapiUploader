import { 
    createContainer,
    asClass,
    asFunction,
}
from 'awilix';
import * as glob from 'fast-glob';

type MatchedFiles = Array<[string, {[key: string]: any}]>;

const matchedFiles = (folders: string[]): MatchedFiles => {
    let files =  glob.sync<string>(folders, {
        cwd: __dirname,

    });

    return files.reduce((acc, fileName) => {
        if (fileName.toLowerCase().includes('controller') || fileName.toLowerCase().includes('reqhandler')) {
            acc.push([fileName, {
                register: asClass,
                lifetime: 'SINGLETON'
            }]);
            return acc;
        } else {
            acc.push([fileName, {
                register: asFunction,
                lifetime: 'SINGLETON'
            }]);
            return acc;
        }
    }, []);
};

const configureContainer = () => {
    const initContainer = createContainer({
        injectionMode: 'CLASSIC'
    });
    initContainer.loadModules(matchedFiles(['db/**/*.js', 'plugins/**/*.js', 'server/**/*.js', 'api/**/*.js']), {
        cwd: __dirname,
        formatName: 'camelCase'
    });

    return initContainer;
};

const container = configureContainer();
console.log(Object.getOwnPropertyNames(container.cradle));