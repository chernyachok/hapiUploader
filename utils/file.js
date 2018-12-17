const mime = require('mime');
const { ClientError } = require('../constants');

const isAccepted = (type, allowedFormats) => allowedFormats.some(item => item === type);

const filterFile = (file, allowedFormats) => {
    const type = mime.getType(file.hapi.filename);
    return isAccepted(type, allowedFormats);
}

const createFileValidationHandler = validate => (fieldName, allowedFormats) => (req, h) => {
    const file = req.payload[fieldName];
    if (!validate(file, allowedFormats)) {
        return h.badRequest(ClientError.invalidFileFormat);
    }
    return true;
}

exports.handleFileValidation = createFileValidationHandler((file, allowedFormats) => filterFile(file, allowedFormats));
