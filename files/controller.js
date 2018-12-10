const fileSystem = require('./fileSystem');
const config = require('../configurations/config.dev.json');

const handleFileUpload = async file => {
    const fileName = file.hapi.filename;
    const data = file._data;

    const isExist = fileSystem.isExist(fileName);
    if(isExist)
        return {message: 'such file exist'};

    await fileSystem.writeFile(fileName, data);

    fileSystem.setFileLow({id: new Date().getTime(), fileName});
    return {message: 'saved succcesfully'};
}

module.exports.fileUpload = async (req, h) => {
    const { file } = req.payload;
    const response = await handleFileUpload(file);
    return h.response(response);
}

module.exports.getListOfFiles = (req, h) => {
        const files = fileSystem.getFilesLow()
        return h.response(files);
}

module.exports.fileDelete = async (req, h) => {
    const { fileToBeDeleted } = req.payload;

    await fileSystem.removeFile(fileToBeDeleted);
    fileSystem.removeFileLow(fileToBeDeleted);

    return {message: 'deleted successfully'};
}

module.exports.mainPage = async (req, h) => {
    try {
        const data = await fileSystem.getApi(`${config.workingDir}/files`);
        const files = fileSystem.getViewOfAllFiles(data);
        
        return h.response(files)
            .type('text/html')
            .code(200);
    } catch (err) {
        console.log(err);
    }
}