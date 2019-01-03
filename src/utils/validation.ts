import * as Joi from 'joi';

export const jwtValidator = Joi.object({
    authorization: Joi.string().required()
}).unknown();

export const idParamValidator = Joi.object().keys({
    id: Joi.number().positive().required()
});
  