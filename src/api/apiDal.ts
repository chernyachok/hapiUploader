import { RESOLVER } from "awilix";

export abstract class ApiReqHandler<ControllerType> {
    constructor(private _controller: ControllerType) {}

    public get controller() {
        return this._controller;
    }
}

ApiReqHandler[RESOLVER] = {};