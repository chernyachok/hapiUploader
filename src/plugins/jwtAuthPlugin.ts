import * as HapiJwt from 'hapi-auth-jwt2';
import { Server } from '../types';
import { ServerConfigurations } from "../configurations";
import { ClientError } from '../constants';
import { Plugin } from '../types';
import { UserModel } from '../db/types';

type ValidateUser = (decoded: any) => Promise<{isValid: boolean}>;

export default class JwtPlugin implements Plugin {

    constructor(
        private server: Server,
        private serverConfigs: ServerConfigurations,
        private userModel: UserModel
    ) {}
    
    private async setAuthStrategy(validate: ValidateUser) {
        this.server.auth.strategy('jwt', 'jwt',
        { key: this.serverConfigs.jwtSecret,          
            validate,           
            verifyOptions: { algorithms: [ 'HS256' ] },
            errorFunc: (errorContext: HapiJwt.ErrorContext) => {
                if (errorContext.errorType === "unauthorized") {
                  errorContext.message = ClientError.invalidToken;
                }
        
                return errorContext;
            }
        });
    
        this.server.auth.default("jwt");
    }
    
    public async register() {
        try {
            await this.server.register(HapiJwt);
           
            const validate: ValidateUser = async decoded => {
                const response = await this.userModel.findOne({ where: { id: decoded.id }});
                return { isValid: !response ? false : true};
            };
            return this.setAuthStrategy(validate);
        } catch (err) {
            console.log('Error registering jwt plugin' + err);
            throw err;
        }
    }
    public info() {
        return { name: "JWT Authentication", version: "1.0.0" };
    }
}