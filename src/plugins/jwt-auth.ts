import * as HapiJwt from 'hapi-auth-jwt2';
import { Server } from '../types/server';
import { ServerConfigurations } from "../configurations";
import { ClientError } from '../constants';
import { PluginObject, Plugin, PluginOptions } from '../types/plugin';

type ValidateUser = (decoded: any) => Promise<{isValid: boolean}>;

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

export default class JwtPlugin implements Plugin {
    
    private async setAuthStrategy(server: Server, configs: ServerConfigurations, validate: ValidateUser) {
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
    
    public async register(server: Server, { serverConfigs, userModel }: PluginOptions) {
        try {
            await server.register(HapiJwt);
           
            const validate: ValidateUser = async decoded => {
                const response = await userModel.findOne({where: { id: decoded.id}});
                return { isValid: !response ? false : true};
            };
            return this.setAuthStrategy(server, serverConfigs, validate);
        } catch (err) {
            console.log(err);
            throw err;
        }
    }
    public info() {
        return { name: "JWT Authentication", version: "1.0.0" };
    }
}