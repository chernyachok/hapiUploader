const currentHost = process.env.HOST;
const currentPort = process.env.PORT;

const workingUrl = (additional) => 
    'http://' + currentHost + ':' +currentPort + (additional ? additional : '');

module.exports = workingUrl;