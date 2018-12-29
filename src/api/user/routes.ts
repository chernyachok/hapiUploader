import { Server } from "../../types/server";
import { ServerConfigurations } from "../../configurations";
import UserController from "./controller";
import {
    signupValidator
} from './validator';
import { jwtValidator } from "../../utils/validation";

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
            description: 'Decode token',
        }
    });
    
    server.route({
        method: 'POST',
        path: '/users/signup',
        options: {
            auth: false,
            handler: userController.signup,
            validate: {
                payload: signupValidator
            },
            description: 'Encode payload into valid token',
        }
    });

}