import { ApiReqHandler } from "../apiDal";
import { Request } from '../../types';
import { Response } from '../../types';
import { ClientError } from "../../constants";
import UserController from "./controller";

export default class UserReqHandler extends ApiReqHandler<UserController> {

    public async getMe (req: Request, h: Response) {
        
           const token = req.headers['authorization'];
           const user = await this.controller.getMe(token);
           
           if (!user) {
            return h.notFound(ClientError.userNotExists);
           }

           return h.response(user);
    }

    public async createUser(req: Request, h: Response) {

            const { username, password } = req.payload;
            
            const token = await this.controller.createUser(username, password);
            return h.response({ message: 'token registered successfully', auth: true, token}).code(201);
    }

    public async getUser(req: Request, h: Response) {

            const { id } = req.params;
            const user = await this.controller.getUser(id);

            if (!user) {
                return h.notFound(ClientError.userNotExists);
            }

            return h.response(user);
    }

    public async getUsers(_: Request, h: Response) {

            const users = await this.controller.getUsers();
            return h.response(users);
    }
}