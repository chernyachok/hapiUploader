import { handleErrorToBoom } from "../utils/error";
import { Request } from '../types';
import { Response } from '../types';

export abstract class ApiReqHandler<ControllerType> {
    constructor(private _controller: ControllerType) {
        for (let key in this._controller as any) {
            if (typeof this._controller[key] === 'function') {
                this._controller[key] = this.decoreWithErrorHandler(this._controller[key]);
            }
        }
    }

    private decoreWithErrorHandler(method: () => any) {
        return (_: Request, h: Response) => {
            try {
                method();
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