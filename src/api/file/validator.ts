import * as Joi from 'joi';
import { Readable } from 'stream';

export const logoModel = Joi.object().keys({
    logo: Joi.object().type(Readable)
});

export const jobModel = Joi.object().keys({
    file: Joi.object().type(Readable)
});

export const deleteValidator = Joi.object().keys({
    id: Joi.number().positive().required()
});

export const updateValidator = Joi.object().keys({
    id: Joi.number().positive().required(),
    newFilename: Joi.string().required()
});

export const jwtValidator = Joi.object({
    authorization: Joi.string().required()
}).unknown();