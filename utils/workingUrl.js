const { protocol, host, port } = require('../configurations').getServerConfigs()

const workingUrl = (additional = '') => 
    protocol + '://' + host + ':' + port + additional;

module.exports = workingUrl;