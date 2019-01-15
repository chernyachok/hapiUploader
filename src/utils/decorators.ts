import { handleErrorToBoom } from "./error";
import { Request, Response } from '../types';
import FileReqHandler from "../api/file/dal";
import UserReqHandler from "../api/user/dal";

type Reference = typeof FileReqHandler | typeof UserReqHandler;

export function dalErrorHandler(target: Reference) {
            const proto = target.prototype;
            for (let key of Object.getOwnPropertyNames(proto)) { 
                
                if (typeof proto[key] === 'function' && key !== 'constructor') {
                    proto[key] = decoreWithErrorHandler(proto[key]);
                }
            }
}

export function methodDalErrorHandler(target: any, prop: string, descriptor: PropertyDescriptor) {
            descriptor.value = decoreWithErrorHandler(descriptor.value);
        
            return descriptor;
}

function decoreWithErrorHandler(method: (req: Request, h: Response) => any) {
    
    return async function(req: Request, h: Response) {
        try {
            
            return await method.call(this, req, h);
        } catch (err) {

            err = handleErrorToBoom(err);
            if (err.isBoom) {
                return err;
            } else {
                return h.badImplementation();
            }
        }
    };
}

