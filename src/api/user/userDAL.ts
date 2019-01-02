import { ApiReqHandler } from "../apiDAL";
import { Request } from '../../types';
import { Response } from '../../types';
import { ClientError } from "../../constants";
import UserController from "./controller";

export default class UserReqHandler extends ApiReqHandler<UserController> {

    public async getMe (req: Request, h: Response) {
        try {
           const token = req.headers['authorization'];
           const user = await this.controller.getMe(token);
           
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
            const token = await this.controller.createUser(username, password);
            return h.response({ message: 'token registered successfully', auth: true, token}).code(201);
        } catch (err) {
            console.log(err);
            return h.badImplementation();   
        }
    }

    public async getUser(req: Request, h: Response) {
        try {
            const { id } = req.params;
            const user = this.controller.getUser(id);

            if (!user) {
                return h.notFound(ClientError.userNotExists);
            }

            return h.response(user);
        } catch (err) {
            console.log(err);
            return h.badImplementation();
        }
    }

    public async getUsers(_: Request, h: Response) {
        try {
            const users = await this.controller.getUsers();

            return h.response(users);
        } catch (err) {
            console.log(err);
            return h.badImplementation();
        }
    }
}