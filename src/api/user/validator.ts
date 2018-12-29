import * as Joi from 'joi';

export const signupValidator = Joi.object({
    id: Joi.number().positive().required(),
    username: Joi.string().required()
});