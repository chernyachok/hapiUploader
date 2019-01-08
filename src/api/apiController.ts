import { ServerConfigurations } from "../configurations";

export abstract class ApiController<ModelType> {
    constructor(
        private _model: ModelType,
        protected _configs: ServerConfigurations
    ) {
        console.log('QWEsd', this.model);
    }

    public get model() {
        return this._model;
    }
}