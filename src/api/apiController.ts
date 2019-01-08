import { ServerConfigurations } from "../configurations";

export abstract class ApiController<ModelType> {
    constructor(
        private _model: ModelType,
        protected _configs: ServerConfigurations
    ) {}

    public get model() {
        return this._model;
    }
}