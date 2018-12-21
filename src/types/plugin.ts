import { Server } from "./server";
import { ServerConfigurations } from "../configurations";

export interface PluginObject {
    name: string;
    version: string;
    register(server: Server, options?: ServerConfigurations): Promise<void>;
}