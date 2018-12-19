import * as axios from 'axios';
import * as mime from 'mime';
import { ClientError } from '../constants';

const { protocol, host, port } = require('../configurations').getServerConfigs();

const isAccepted = (type, allowedFormats) => allowedFormats.some(item => item === type);

const filterFile = file =>  allowedFormats => {
    const type = mime.getType(file.hapi.filename);
    return isAccepted(type, allowedFormats);
}

const createFileValidationHandler = validate => (fieldName, allowedFormats) => (req, h) => {
    const file = req.payload[fieldName];
    if (!validate(file, allowedFormats)) {
        return h.badData(ClientError.invalidFileFormat);
    }
    return true;
}

exports.handleFileValidation = createFileValidationHandler((file, allowedFormats) => filterFile(file)(allowedFormats));

exports.getImageAllowedFormats = () => {
    return  [
            "image/png", 
            "image/jpg", 
            "image/jpeg"
        ];
}

exports.getDocsAllowedFormats = () => {
    return [
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
}

exports.workingUrl = (additional = '') => 
    protocol + '://' + host + ':' + port + additional;

exports.getApi = async (url) => {
    const { data } = await axios.get(url);
    return data;
}

exports.getHtmlString = data => {
    let files = '';
        data.length && data.forEach((item, index) => {
           if (index === 0) {
               let keysArr = [];
               for(key in item) {
                keysArr.push(key);
               }
               keysArr.forEach((item2, index2) => {
                   index2 === 0 ? files = '<tr>': undefined;
            
                   files += `<th>${item2}</th>`;

                   index2 === (keysArr.length-1)? files += '</tr>' : undefined;
               })
           }
           files += `
            <tr>
                <td>${item.id}</td>
                <td>${item.filename}</td>
                <td><a href='${item.url}'>${item.url}</a></td>
            </tr>
           `;
        });
    
    return files ? `<table>${files}</table>` : '<h4>No files available!</h4>';
}
