import { Server } from "./server";
import { ServerConfigurations } from "../configurations";
import { Models, UserModel } from "../db/types";

export interface PluginOptions {
    model: Models;
    serverConfigs: ServerConfigurations;
}

export interface PluginObject {
    name: string;
    version: string;
    register(server: Server, options?: ServerConfigurations): Promise<void>;
}

export interface Plugin {
    register(server: Server, serverConfigs?: ServerConfigurations, userModel?: UserModel ): Promise<void>;
    info(): PluginInfo;
}

export interface PluginInfo {
    name: string;
    version: string;
}

export interface PluginConstructor {
    new(): Plugin;
}