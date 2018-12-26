import initDb from '../db/initDb';
import { ServerConfigurations } from '../configurations';
import { Server } from '../types/server';
import { PluginObject, Plugin, PluginOptions } from '../types/plugin';
import { Sequelize } from 'sequelize';

export default class SequelizePlugin implements Plugin {

    private _name: string;
    private _version: string;

    private createSequelizePlugin(serverConfigs: ServerConfigurations): PluginObject {
        return {
            name: 'Sequelize',
            version: '1.1.0',
            register: async function(server: Server) {
                const connectionDb: Sequelize = await initDb(serverConfigs);
                server.decorate('server', 'db', () => connectionDb);
            }
        };
    }

    public async register(server: Server, { serverConfigs }: PluginOptions): Promise<void> {
        try {
          const plugin = this.createSequelizePlugin(serverConfigs);
          this._name = plugin.name;
          this._version = plugin.version;

          await server.register(plugin);
        } catch (err) {
          console.log(`Error registering boom plugin: ${err}`);
          throw err;
        }
    }

    public info() {
        return { name: this._name, version: this._version };
    }
}