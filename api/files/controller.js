const fs = require('fs-extra');
const path = require('path');
const handleFileUpload = async file => {
    const fileName = file.hapi.filename;
    const data = file._data;

    const parsedList = await fs.readJson(path.join(__dirname, '..', '..', 'configurations/list.json'))
    const isExist = fs.existsSync(path.join(__dirname, '..' , '..' , '/public/imgs', fileName));
    if(isExist)
        return ({message: 'such file exists'});
    await fs.writeFile(path.join(__dirname, '..' , '..' , '/public/imgs', fileName), data)

    parsedList.files.push({ id: new Date().getTime(), src: fileName });

    await fs.writeJson(path.join(__dirname, '..', '..', 'configurations/list.json'), parsedList);
    return {message: 'saved succcesfully'}
}

module.exports.fileUpload = async (req, h) => {
    const { file } = req.payload;
    const response = await handleFileUpload(file)
    return h.response(response);
}

module.exports.getListOfFiles = async (req, h) => {
        let listOffileNames = '';
        const parsedList = await fs.readJson(path.join(__dirname, '..', '..', 'configurations/list.json'))
        parsedList.files.forEach(item => {
            listOffileNames += (item.src + '<br/>')
        });
        return h.response(listOffileNames).type('text/html');
    }
module.exports.fileDelete = async (req, h) => {
    const { fileToBeDeleted } = req.payload;

    await fs.remove(path.join(__dirname, '..' , '..' , 'public', 'imgs', fileToBeDeleted));
    let parsedList = await fs.readJson(path.join(__dirname, '..', '..', 'configurations/list.json'));
    parsedList.files = parsedList.files.filter(item => item.src !== fileToBeDeleted);
    await fs.writeJson(path.join(__dirname, '..', '..', 'configurations/list.json'), parsedList);

    return {message: 'deleted successfully'}
}