const fs = require('fs-extra');
const list = require('./list.json');

const handleFileUpload = async file => {
    const fileName = file.hapi.filename;
    const data = file._data;
    const parsedList = list.files ? { ...list } : {files: []};
    for(let i = 0; i < parsedList.files.length; i++){
        if(parsedList.files[i].src === fileName)
            return {message: 'such file already exist'};
    }
    await fs.writeFile(`./public/imgs/${fileName}`, data)

    parsedList.files.push({ id: new Date().getTime(), src: fileName });

    await fs.writeJson('list.json', parsedList);
    return {message: 'saved succcesfully'}
}

module.exports = handleFileUpload;