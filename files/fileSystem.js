const fs = require('fs-extra');
const path = require('path');

const readJson = async () => {
    const data = await fs.readJson(path.join(process.cwd(), 'localStorage/list.json'));
    return data;
};

const writeJson = async (parsedList) => {
    const data = await fs.writeJson(path.join(process.cwd(), 'localStorage/list.json'), parsedList);
    return data;
};

const isExist = (fileName) => {
    return fs.existsSync(path.join(process.cwd(), 'public/imgs', fileName));
}

const writeFile = (fileName, data) => {
    return fs.writeFile(path.join(process.cwd() , 'public/imgs', fileName), data);
}

const removeFile = (fileToBeDeleted) => {
    return fs.remove(path.join(process.cwd(), 'public/imgs', fileToBeDeleted));
} 

module.exports = {
    readJson,
    writeJson,
    isExist,
    writeFile,
    removeFile
}