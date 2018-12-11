const currentHost = process.env.HOST;
const currentPort = process.env.PORT;

const workingUrl = 'http://' + currentHost + ':' +currentPort;

module.exports = workingUrl;