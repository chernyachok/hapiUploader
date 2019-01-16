import { ServerConfigurations } from "../configurations";
import { RESOLVER } from "awilix";

export abstract class ApiController<ModelType> {
    constructor(
        private _model: ModelType,
        protected _configs: ServerConfigurations
    ) {}

    public get model() {
        return this._model;
    }
}

ApiController[RESOLVER] = {};