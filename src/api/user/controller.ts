import { UserModel } from "../../db/types";
import { Request } from '../../types';
import { Response } from '../../types';
import { generateToken, decodeToken } from './utils';
import { ClientError } from "../../constants";
import { ApiController } from "../apiController";

export default class UserController extends ApiController<UserModel> {

    public async getMe (req: Request, h: Response) {
        try {
            const token = req.headers['authorization'];
            const decodedToken = decodeToken(token, this._configs.jwtSecret);
            const user = await this.model.findOne({ where: {id: decodedToken.id}});
            if (!user) {
                return h.badRequest(ClientError.userNotExists);
            }
            return h.response(user);
        } catch (err) {
            console.log(err);
            return h.badImplementation();
        }
    }

    public async createUser(req: Request, h: Response) {
        try {
            const { username, password } = req.payload;
            const { dataValues } = await this.model.create({
                username,
                password,
            });
            const token = generateToken({ 
                id: dataValues.id, },
                this._configs.jwtSecret,
                this._configs.jwtExpiration
            );
            return h.response({ message: 'token registered successfully', auth: true, token}).code(201);
        } catch (err) {
            console.log(err);
            return h.badImplementation();   
        }
    }

    public async getUser(req: Request, h: Response) {
        try {
            const { id } = req.params;
            const user = await this.model.findOne({ where: {id}});

            if (!user) {
                return h.notFound(ClientError.userNotExists);
            }

            return h.response(user);
        } catch (err) {
            console.log(err);
            return h.badImplementation();
        }
    }

    public async getUsers(req: Request, h: Response) {
        try {
            const users = await this.model.findAll();

            return h.response(users);
        } catch (err) {
            console.log(err);
            return h.badImplementation();
        }
    }
}