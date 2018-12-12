function getServerConfigs() {
    return {
        port: process.env.PORT,
        host: process.env.HOST,
        protocol: 'http',
        dbName: process.env.DB_NAME
    }
}

module.exports = {
    getServerConfigs
}