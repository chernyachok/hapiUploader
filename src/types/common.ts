import { ServerConfigurations } from "../configurations";
import { UserModel } from "./userModel";
import { Sequelize } from "sequelize";

export interface ApiEnterOptions {
    serverConfigs: ServerConfigurations;
    userModel: UserModel;
    dbConnection: Sequelize;
}