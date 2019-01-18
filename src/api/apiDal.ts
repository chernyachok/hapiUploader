import { RESOLVER } from "awilix";

export abstract class ApiDal<ControllerType> {
    constructor(private _controller: ControllerType) {}

    public get controller() {
        return this._controller;
    }
}

ApiDal[RESOLVER] = {};