const joi = require('joi');

module.exports.deleteValidator = joi.object().keys({
    fileToBeDeleted: joi.string().required()
})
