import { Server } from "../../types";
import { ServerConfigurations } from "../../configurations";
import {
    createUserValidator
} from './userValidator';
import { jwtValidator, idParamValidator } from "../../utils/validation";
import UserReqHandler from "./userDal";

export default async function init(server: Server, configs: ServerConfigurations, userController: UserReqHandler) {

    server.route({
        method: 'GET',
        path: '/users/me',
        options: {
            auth: false,
            handler: userController.getMe,
            validate: {
                headers: jwtValidator
            },
            description: "Receive user by jwt-token.",
        }
    });
    
    server.route({
        method: 'POST',
        path: '/users',
        options: {
            auth: false,
            handler: userController.createUser,
            validate: {
                payload: createUserValidator
            },
            description: "Create new user and receive token",
        }
    });

    server.route({
        method: 'GET',
        path: '/users/{id}',
        options: {
            auth: 'jwt',
            handler: userController.getUser,
            validate: {
                params: idParamValidator
            },
            description: "Get user by id.",
        }
    });

    server.route({
        method: 'GET',
        path: '/users',
        options: {
            auth: 'jwt',
            handler: userController.getUsers,
            validate: {
                headers: jwtValidator
            },
            description: "Get all users",
        }
    });

}