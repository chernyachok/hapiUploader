export interface ServerConfigurations {
    port: number;
    host: string;
    protocol: string;
    dbName: string;
    dbUser: string;
    dbUserPass: string;
    dbDialect: string;
    pathToImgs: string;
}

export function getServerConfigs(): ServerConfigurations {
    return {
        port: parseInt(process.env.PORT, 10),
        host: process.env.HOST,
        protocol: 'http',
        dbName: process.env.DB_NAME,
        dbUser: process.env.DB_USER,
        dbUserPass: process.env.DB_USER_PASS,
        dbDialect: process.env.DB_DIALECT,
        pathToImgs: process.env.STATIC_FOLDER
    }
}