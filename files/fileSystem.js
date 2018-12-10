const fs = require('fs-extra');
const path = require('path');
const axios = require('axios');
const db = require('../server/lowDbConnect');
const config = require('../configurations/config.dev.json');

const getFilesLow = () => db.get('files').value();

const setFileLow = newFile => db.get('files').push(newFile).write();

const removeFileLow = fileName => db.get('files').remove({ fileName }).write();

const isExist = (fileName) => 
    fs.existsSync(path.join(process.cwd(), 'public/imgs', fileName));

const writeFile = (fileName, data) =>
    fs.writeFile(path.join(process.cwd() , 'public/imgs', fileName), data);

const removeFile = (fileToBeDeleted) =>
    fs.remove(path.join(process.cwd(), 'public/imgs', fileToBeDeleted));

const getApi = async (url) => {
    const {data} = await axios.get(url);
    return data;
}

const getViewOfAllFiles = data => {
    let files = '';
        data.length && data.forEach((item, index) => {
           if (index === 0) {
               let keysArr = [];
               for(key in item) {
                keysArr.push(key);
               }
               files = `<tr><th>${keysArr[0]}</th><th>${keysArr[1]}</th></tr>`;   
           }
           files += `
            <tr>
                <td>${item.id}</td>
                <td><a href='${config.workingDir}/files/${item.fileName}'>${item.fileName}</a></td>
            </tr>
           `;
        });
    
    return files ? `<table>${files}</table>` : '<h4>No files available!</h4>'
}

module.exports = {
    getFilesLow,
    setFileLow,
    removeFileLow,
    isExist,
    writeFile,
    removeFile,
    getViewOfAllFiles,
    getApi
}