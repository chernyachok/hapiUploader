import  FileSystem from './fileSystem';
import { workingUrl, getApi } from './utils';
import { ClientError } from '../constants';
import { IFileController } from './type';
import { SequelizeModel } from '../types/model';

export default class FileController implements IFileController {
    private _fileModel: SequelizeModel;
    private _fileSystem: FileSystem;

    constructor(fileModel: SequelizeModel, pathToImgs: string) {
        this._fileModel = fileModel;
        this._fileSystem = new FileSystem(pathToImgs);
    }
    private async handleFileUpload (file, h) {
        try {
            const { filename } = file.hapi;
            const data = file._data;
        
            const isExist = this._fileSystem.isExist(filename);
            if(isExist)
                return h.badRequest(ClientError.fileAlreadyExists);
        
            await this._fileSystem.writeFile(filename, data);
            const url = workingUrl('/files/' + filename);
            await this._fileModel.create({
               filename,
               url 
            });
            return h.response({message: 'file uploaded succcesfully'}).code(201);
        } catch (err) {
                return h.badImplementation();
        }
    }

    async getListOfFiles(req, h) {
        try {
            console.log(req._core.registrations);
            const files = await this._fileModel.findAll();
            return h.response(files).code(200);
        }  catch (err) {
                return h.badImplementation();
        }
    }

    async getViewOfListOfFiles(req, h) {
        try {
            const url = workingUrl('/files');
            const data = await getApi(url);
            const files = getHtmlString(data);
            
            return h.response(files)
                .type('text/html')
                .code(200);
        }  catch (err) {
                return h.badImplementation();
        }
    }

    async saveLogo(req, h) {
        const { logo } = req.payload;
        return this.handleFileUpload(logo, h);
    }

    async saveJob(req, h) {
        const { file } = req.payload;
        return this.handleFileUpload(file, h);
    }

    async updateFile(req, h) {
        try {
            const {id, newFilename} = req.payload;
            const response = await this._fileModel.findOne({where: { id }});
    
            if(response === null) {
                return h.badRequest(ClientError.fileNotExists);
            }
    
            await this._fileSystem.renameFile(response.dataValues.filename, newFilename);
    
            const newUrl = workingUrl('/files/' + newFilename);
            await this._fileModel.update({filename: newFilename, url: newUrl}, {where: {id}});
            return h.response({message: 'updated successfully'}).code(200);
        }  catch (err) {
                return h.badImplementation();
        }
    }
    
    async deleteFile(req, h) {
        try {
            const { id } = req.payload;
            const response = await this._fileModel.findOne({where: {id}});
            if(response === null) {
                return h.badRequest(ClientError.fileNotExists);
            }
    
            await this._fileSystem.removeFile(response.dataValues.filename);
            await this._fileModel.destroy({where: { id }});
            return h.response({message: 'deleted successfully'}).code(200);    
        }  catch (err) {
                return h.badImplementation();
        }
        
    }
}