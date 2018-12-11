const workingUrl = (additional = '') => 
    'http://' + process.env.HOST + ':' + process.env.PORT + additional;

module.exports = workingUrl;