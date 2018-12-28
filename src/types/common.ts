import { ServerConfigurations } from "../configurations";
import { Models } from "../db";

export interface ApiEnterOptions {
    serverConfigs: ServerConfigurations;
    modelList: Models;
}