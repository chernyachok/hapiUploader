import { Server } from "./server";
import { ServerConfigurations } from "../configurations";

export interface PluginObject {
    name: string;
    version: string;
    register(server: Server, options?: ServerConfigurations): Promise<void>;
}

export interface Plugin {
    register(): Promise<void>;
    info(): PluginInfo;
}

export interface PluginInfo {
    name: string;
    version: string;
}
