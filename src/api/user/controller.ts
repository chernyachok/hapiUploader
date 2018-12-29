import { UserModel } from "../../db/types";
import { ServerConfigurations } from "../../configurations";
import { Request } from '../../types/request';
import { Response } from '../../types/response';
import { generateToken, decodeToken } from '../../utils/auth';

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
            const decodedToken = decodeToken(token, this._configs.jwtSecret);
            return h.response(decodedToken);
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
            const token = generateToken({ 
                id: dataValues.id, username: dataValues.username },
                this._configs.jwtSecret,
                this._configs.jwtExpiration
            );
            return h.response({ message: 'token registered successfully', auth: true, token});
        } catch (err) {
            console.log(err);
            return h.badImplementation();   
        }
    }

}