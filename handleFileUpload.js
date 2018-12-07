const fs = require('fs');
const list = require('./list.json');

const handleFileUpload = async file => {
    const fileName = file.hapi.filename;
    const data = file._data;
    const parsedList = { ...list };
    for(let i = 0; i < parsedList.files.length; i++){
        if(parsedList.files[i].src === fileName)
            return {message: 'such file already exist'};
    }
    fs.writeFile(`./public/imgs/${fileName}`, data, err => {
        if (err) {
            throw err
        }

        parsedList.files.push({ id: new Date().getTime(), src: fileName });

        fs.writeFile('list.json', JSON.stringify(parsedList), (err) => {
            if (err) throw err
            return {message: 'uploaded succcesfully'}
        })
    })
}

module.exports = handleFileUpload;