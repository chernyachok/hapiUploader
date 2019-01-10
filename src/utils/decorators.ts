import { handleErrorToBoom } from "./error";
import { Request, Response } from '../types';

export function dalErrorHandler(isDecorated: boolean) {
    if (isDecorated) {
        return function (target: any) {
            const proto = target.prototype;
            for (let key of Object.getOwnPropertyNames(proto)) { 
                
                if (typeof proto[key] === 'function' && key !== 'constructor') {
                    proto[key] = decoreWithErrorHandler(proto[key]);
                }
            }
        }; 
    }  else {
        return;
    } 
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