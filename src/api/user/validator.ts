import * as Joi from 'joi';

export const createUserValidator = Joi.object().keys({
    username: Joi.string().required(),
    password: Joi.string().required(),
});
