import { Server } from "./server";
import { ServerConfigurations } from "../configurations";
import { UserModel } from "./userModel";

export interface PluginOptions {
    userModel: UserModel;
    serverConfigs: ServerConfigurations;
}

export interface PluginObject {
    name: string;
    version: string;
    register(server: Server, options?: ServerConfigurations): Promise<void>;
}

export interface Plugin {
    register(server: Server, options?: PluginOptions): Promise<void>;
    info(): PluginInfo;
}

export interface PluginInfo {
    name: string;
    version: string;
}