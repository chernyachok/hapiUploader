import { UserModel } from "../../db/types";
import { generateToken, decodeToken } from './userUtils';
import { ApiController } from "../apiController";
import { ServerConfigurations } from "../../configurations";

export default class UserController extends ApiController<UserModel> {

    constructor(
        userModel: UserModel,
        serverConfigs: ServerConfigurations
    ) {
        super(userModel, serverConfigs);
    }

    public async getMe (token: string) {
            const decodedToken = decodeToken(token, this._configs.jwtSecret);
            return this.model.findOne({ where: {id: decodedToken.id}});
    }

    public async createUser(username: string, password: string) {
            const { dataValues } = await this.model.create({
                username,
                password,
            });
            return generateToken({ 
                id: dataValues.id, },
                this._configs.jwtSecret,
                this._configs.jwtExpiration
            );
    }

    public async getUser(id: string) {
            return this.model.findOne({ where: {id}});
    }

    public async getUsers() {
            return this.model.findAll();
    }
}