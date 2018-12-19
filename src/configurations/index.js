function getServerConfigs() {
    return {
        port: process.env.PORT,
        host: process.env.HOST,
        protocol: 'http',
        dbName: process.env.DB_NAME,
        dbUser: process.env.DB_USER,
        dbUserPass: process.env.DB_USER_PASS,
        dbDialect: process.env.DB_DIALECT,
        pathToImgs: process.env.STATIC_FOLDER
    };
}
module.exports = {
    getServerConfigs: getServerConfigs
};
