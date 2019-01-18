export abstract class ApiDal<ControllerType> {
    constructor(private _controller: ControllerType) {}

    public get controller() {
        return this._controller;
    }
}
