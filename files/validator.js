const joi = require('joi');
const {Readable} = require('stream');

module.exports.uploadFileValidator = joi.object().keys({
    file: joi.object().type(Readable)
})

module.exports.deleteValidator = joi.object().keys({
    id: joi.number().positive().required()
})

module.exports.updateValidator = joi.object().keys({
    id: joi.number().positive().required(),
    newFilename: joi.string().required()
})