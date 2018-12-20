const FormData = require('form-data');
const path = require('path');
const fs = require('fs');

const createFormData = () => {
    const formData = new FormData();
    return formData;
}

const getFileStream = (fileName) => {
    const fileStream = fs.createReadStream(path.join(__dirname, 'mocks', fileName));
    return fileStream;
}

const appendFiles = (formData, fileNames, fieldName='file') => {
    fileNames.forEach(fileName => {
        const fileStream = getFileStream(fileName);
    
        formData.append(fieldName, fileStream);
      });
    
      return formData;
}

module.exports = {
    createFormData,
    appendFiles
}