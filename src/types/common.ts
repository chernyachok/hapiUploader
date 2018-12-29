import { ServerConfigurations } from "../configurations";
import { Models } from "../db/types";

export interface ApiEnterOptions {
    serverConfigs: ServerConfigurations;
    modelList: Models;
}