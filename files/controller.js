const fileSystem = require('./fileSystem');
const workingUrl = require('../utils/workingUrl');
const dbService = require('./dbService');
const utils = require('./utils');

const handleFileUpload = async file => {
    const fileName = file.hapi.filename;
    const data = file._data;

    const isExist = fileSystem.isExist(fileName);
    if(isExist)
        return {message: 'such file exist'};

    await fileSystem.writeFile(fileName, data);
    const url = workingUrl('/files/' + fileName);
    dbService.setFileLow({
        id: new Date().getTime(),
        fileName,
        url 
    });
    return {message: 'saved succcesfully'};
}

exports.fileUpload = async (req, h) => {
    const { file } = req.payload;
    const response = await handleFileUpload(file);
    return h.response(response);
}

exports.getListOfFiles = (req, h) => {
        const files = dbService.getFilesLow()
        return h.response(files);
}

exports.fileDelete = async (req, h) => {
    const { fileToBeDeleted } = req.payload;
    const isExist = dbService.findFileLow(fileToBeDeleted);
    if(!isExist) {
        return { message: 'no such file exist' };
    }
    await fileSystem.removeFile(fileToBeDeleted);
    dbService.removeFileLow(fileToBeDeleted);

    return {message: 'deleted successfully'};
}

exports.mainPage = async (req, h) => {
    try {
        const url = workingUrl('/files');
        const data = await utils.getApi(url);
        const files = utils.getViewOfAllFiles(data);
        
        return h.response(files)
            .type('text/html')
            .code(200);
    } catch (err) {
        console.log(err);
    }
}