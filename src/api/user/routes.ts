import { Server } from "../../types";
import { ServerConfigurations } from "../../configurations";
import UserController from "./controller";
import {
    createUserValidator
} from './validator';
import { jwtValidator, idParamValidator } from "../../utils/validation";

export default async function(server: Server, configs: ServerConfigurations, userController: UserController) {

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