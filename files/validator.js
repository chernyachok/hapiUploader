const joi = require('joi');

module.exports.uploadFileValidator = joi.object().keys({
    file: Joi.object().type(Readable)
})

module.exports.deleteValidator = joi.object().keys({
    id: joi.number().positive().required()
})

module.exports.updateValidator = joi.object().keys({
    id: joi.number().positive().required(),
    newFilename: string().required()
})