import { ServerConfigurations } from "../configurations";
import { IBoomMethods } from '../types';

export abstract class ApiController<ModelType> {
    constructor(
        private _model: ModelType,
        protected _configs: ServerConfigurations,
        protected _boom: IBoomMethods
    ) {}

    public get model() {
        return this._model;
    }
}