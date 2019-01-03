import Boom from 'boom';
import { ServerConfigurations } from "../configurations";
import { Models } from "../db/types";

export interface ApiEnterOptions {
    serverConfigs: ServerConfigurations;
    modelList: Models;
}

type BoomCreator = (message?: string) => Boom;

export interface IBoomMethods {
    badImplementation: BoomCreator;
    notFound: BoomCreator;
    badData: BoomCreator;
    unauthorized: BoomCreator;
    badRequest: BoomCreator;
}