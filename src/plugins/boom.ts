import Boom from 'boom';
import { Server } from '../types/server';
import { PluginObject } from '../types/plugin';

const methods: string[] = [
    "badImplementation", // 500
    "notFound", // 404
    "badData", // 422
    "unauthorized", // 401
    "badRequest" // 400
  ];

export const boomPlugin: PluginObject = {
    name: "Boom",
    version: "1.0.0",
    register: async function (server: Server) {
        methods.forEach(method => {
            const boomHandler = (message: string) => Boom[method](message);
            server.decorate('toolkit', method, boomHandler);
        }); 
    }
};