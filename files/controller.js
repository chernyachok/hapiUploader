const fileSystem = require('./fileSystem');
const workingUrl = require('../utils/workingUrl');
const utils = require('./utils');

class FileController {
    constructor(fileModel) {
        this._fileModel = fileModel;
        this.getListOfFiles = this.getListOfFiles.bind(this);
        this.uploadFile = this.uploadFile.bind(this);
        this.updateFile = this.updateFile.bind(this);
        this.deleteFile = this.deleteFile.bind(this);
        this.handleFileUpload = this.handleFileUpload.bind(this);
    }
    //private
    async handleFileUpload (file) {
        const {filename} = file.hapi;
        const data = file._data;
    
        const isExist = fileSystem.isExist(filename);
        if(isExist)
            return {message: 'such file exist'};
    
        await fileSystem.writeFile(filename, data);
        const url = workingUrl('/files/' + filename);
        await this._fileModel.create({
           filename,
           url 
        });
        return {message: 'file uploaded succcesfully'};
    }

    async getListOfFiles(req, h) {
        const files = await this._fileModel.findAll();
        return h.response(files).code(200);
    }

    async getViewOfListOfFiles(req, h) {
        try {
            const url = workingUrl('/files');
            const data = await utils.getApi(url);
            const files = utils.getHtmlString(data);
            
            return h.response(files)
                .type('text/html')
                .code(200);
        } catch (err) {
            console.log(err);
        }
    }

    async uploadFile(req, h) {
        const { file } = req.payload;
        const response = await this.handleFileUpload(file);
        return h.response(response).code(201);
    }

    async updateFile(req, h) {
        const {id, newFilename} = req.payload;
        const response = await this._fileModel.findOne({where: {id}});

        if(response === null) {
            return h.response({ message: 'no file with such id exist' });
        }

        await fileSystem.renameFile(response.dataValues.filename, newFilename);

        const newUrl = workingUrl('/files/' + newFilename);
        await this._fileModel.update({filename: newFilename, url: newUrl}, {where: {id}});
        return h.response({message: 'updated successfully'}).code(200);
    }
    
    async deleteFile(req, h) {
        const { id } = req.payload;
        const response = await this._fileModel.findOne({where: {id}});

        if(response === null) {
            return h.response({ message: 'no file with such id exist' });
        }

        await fileSystem.removeFile(response.dataValues.filename);
        await this._fileModel.destroy({where: {id}});
    
        return h.response({message: 'deleted successfully'}).code(200);
    }
} 

module.exports = FileController;