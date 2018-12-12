function getServerConfigs() {
    return {
        port: process.env.PORT,
        host: process.env.HOST,
        protocol: 'http'
    }
}

module.exports = {
    getServerConfigs
}