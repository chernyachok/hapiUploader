const Boom = require('boom');

const methods = [
    "badImplementation", // 500
    "notFound", // 404
    "badData", // 422
    "unauthorized", // 401
    "badRequest" // 400
  ];

exports.boomPlugin = {
    name: "Boom",
    version: "1.0.0",
    register: async function (server) {
        methods.forEach(method => {
            const boomHandler = (message) => Boom[method](message);
            server.decorate('toolkit', method, boomHandler);
        }); 
    }
};