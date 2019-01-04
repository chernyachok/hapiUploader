export abstract class ApiReqHandler<ControllerType> {
    constructor(private _controller: ControllerType) {}

    public get controller() {
        return this._controller;
    }
}