import Boom from 'boom';
import { Server } from '../types/server';
import { PluginObject, Plugin } from '../types/plugin';

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

export default class BoomPlugin implements Plugin {
    async register(server: Server): Promise<void> {
        try {
          return server.register(boomPlugin);
        } catch (err) {
          console.log(`Error registering boom plugin: ${err}`);
          throw err;
        }
    }
    
    info() {
        return { name: boomPlugin.name, version: boomPlugin.version };
    }
}