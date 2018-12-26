import { Server } from "../../types/server";
import { ServerConfigurations } from "../../configurations";
import UserController from "./controller";

export default async function(server: Server, configs: ServerConfigurations, userController: UserController) {
    server.route({
        method: 'POST',
        path: '/user/signup',
        options: {
            auth: false,
            handler: userController.signup,
            validate: {
                payload: signupValidator
            },
            description: 'Encode payload into valid token',
        }
    });

    server.route({
        method: 'GET',
        path: '/user/me',
        options: {
            auth: false,
            handler: userController.getMe,
            validate: {
                headers: jwtValidator
            },
            description: 'Decode token',
        }
    });
}