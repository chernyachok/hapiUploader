import * as HapiJwt from 'hapi-auth-jwt2';
import { Server } from '../types/server';
import { ServerConfigurations } from "../configurations";
import { ClientError } from '../constants';
import createUserModel from '../db/models/user'; 

const users = {
    20: {
        id: 20,
        username: 'anton'
    }
};

type ValidateUser = (decoded: any) => Promise<{isValid: boolean}>;

export default async function createJwtPlugin(server: Server, configs: ServerConfigurations): Promise<void> {
    try {
        await server.register(HapiJwt);
        const userModel = await createUserModel(server.db());
        const validate: ValidateUser = async decoded => {
            const response = await userModel.findOne({where: { id: decoded.id}});
            console.log(response);
            return { isValid: !response ? false : true};
        };
        return setAuthStrategy(server, configs, validate);
    } catch (err) {
        console.log(err);
        throw err;
    }
}

async function setAuthStrategy(server: Server, configs: ServerConfigurations, validate: ValidateUser) {
    server.auth.strategy('jwt', 'jwt',
    { key: configs.jwtSecret,          
        validate,           
        verifyOptions: { algorithms: [ 'HS256' ] },
        errorFunc: (errorContext: HapiJwt.ErrorContext) => {
            if (errorContext.errorType === "unauthorized") {
              errorContext.message = ClientError.invalidToken;
            }
    
            return errorContext;
        }
    });

    server.auth.default("jwt");
} 