import { handleErrorToBoom } from "../utils/error";
import { Request } from '../types';
import { Response } from '../types';

export abstract class ApiReqHandler<ControllerType> {
    constructor(private _controller: ControllerType) {
        
        for (let key of Object.getOwnPropertyNames((this as any).__proto__)) {   
            if (typeof (this as any).__proto__[key] === 'function' && key !== 'constructor') {
                (this as any).__proto__[key] = this.decoreWithErrorHandler((this as any).__proto__[key]);
            }
        }
    }

    private decoreWithErrorHandler(method: (req: Request, h: Response) => any) {

        return async (req: Request, h: Response) => {
            try {
                
                return await method.call(this, req, h);
            } catch (err) {

                err = handleErrorToBoom(err.message);
                if (err.isBoom) {
                    return err;
                } else {
                    return h.badImplementation();
                }
            }
        };
    }

    public get controller() {
        return this._controller;
    }
}