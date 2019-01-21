import { Server } from "../../types";
import {
    createUserValidator
} from './userValidator';
import { jwtValidator, idParamValidator } from "../../utils/validation";
import UserDal from "./userDal";

export default async function init(server: Server, userDal: UserDal) {

    server.bind(userDal); 
    
    server.route({
        method: 'GET',
        path: '/users/me',
        options: {
            auth: false,
            handler: userDal.getMe,
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
            handler: userDal.createUser,
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
            handler: userDal.getUser,
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
            handler: userDal.getUsers,
            validate: {
                headers: jwtValidator
            },
            description: "Get all users",
        }
    });

}