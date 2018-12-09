const fileSystem = require('./fileSystem');

const handleFileUpload = async file => {
    const fileName = file.hapi.filename;
    const data = file._data;

    const isExist = fileSystem.isExist(fileName);
    if(isExist)
        return {message: 'such file exist'};

    await fileSystem.writeFile(fileName, data);

    const parsedList = await fileSystem.readJson();
    
    parsedList.files.push({ id: new Date().getTime(), src: fileName });

    await fileSystem.writeJson(parsedList);
    return {message: 'saved succcesfully'};
}

module.exports.fileUpload = async (req, h) => {
    const { file } = req.payload;
    const response = await handleFileUpload(file);
    return h.response(response);
}

module.exports.getListOfFiles = async (req, h) => {
        const parsedList = await fileSystem.readJson()
        return h.response(parsedList.files);
}

module.exports.fileDelete = async (req, h) => {
    const { fileToBeDeleted } = req.payload;

    await fileSystem.removeFile(fileToBeDeleted);
    let parsedList = await fileSystem.readJson();
    parsedList.files = parsedList.files.filter(item => item.src !== fileToBeDeleted);
    await fileSystem.writeJson(parsedList);

    return {message: 'deleted successfully'};
}