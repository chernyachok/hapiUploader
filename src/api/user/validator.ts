import * as Joi from 'joi';

export const jwtValidator = Joi.object({
    authorization: Joi.string().required()
}).unknown();

export const signupValidator = Joi.object({
    id: Joi.number().positive().required(),
    username: Joi.string().required()
});