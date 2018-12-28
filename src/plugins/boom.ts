import Boom from 'boom';
import { Server } from '../types';
import { PluginObject, Plugin } from '../types';

const methods: string[] = [
    "badImplementation", // 500
    "notFound", // 404
    "badData", // 422
    "unauthorized", // 401
    "badRequest" // 400
  ];

export default class BoomPlugin implements Plugin {

    private _name: string;
    private _version: string;

    private createBoomPlugin(): PluginObject {
        return {
            name: "Boom",
            version: "1.0.0",
            register: async function (server: Server) {
                methods.forEach(method => {
                    const boomHandler = (message: string) => Boom[method](message);
                    server.decorate('toolkit', method, boomHandler);
                }); 
            }
        };
    }

    public async register(server: Server): Promise<void> {
        try {
          const plugin  = this.createBoomPlugin(); 
          this._name = plugin.name;
          this._version = plugin.version;
          return server.register(plugin);
        } catch (err) {
          console.log(`Error registering boom plugin: ${err}`);
          throw err;
        }
    }
    
    public info() {
        return { name: this._name, version: this._version };
    }
}