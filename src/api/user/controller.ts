import { UserModel } from "../../db/types";
import { ServerConfigurations } from "../../configurations";
import { Request } from '../../types/request';
import { Response } from '../../types/response';
import jwt from 'jsonwebtoken';

export default class UserController {

    private _userModel: UserModel;
    private _configs: ServerConfigurations;

    constructor(userModel: UserModel, serverConfigs: ServerConfigurations) {
        this._userModel = userModel;
        this._configs = serverConfigs;
    }

    public async getMe (req: Request, h: Response) {
        try {
            const token = req.headers['authorization'];
            const decoded = jwt.verify(token, this._configs.jwtSecret, {
                algorithms: ['HS256']
            });
            return h.response(decoded);
        } catch (err) {
            console.log(err);
            return h.badImplementation();
        }
    }

    public async signup(req: Request, h: Response) {
        try {
            const { username } = req.payload;
            const { dataValues } = await this._userModel.create({
                username
            });
            const token = jwt.sign({ id: dataValues.id, username: dataValues.username }, this._configs.jwtSecret, {
                algorithm: 'HS256'
            });
            return h.response({ message: 'token register successfully', auth: true, token});
        } catch (err) {
            console.log(err);
            return h.badImplementation();   
        }
    }

}