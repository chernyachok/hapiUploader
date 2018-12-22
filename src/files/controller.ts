import FileSystem from './fileSystem';
import { workingUrl, getApi, getHtmlString } from './utils';
import { ClientError } from '../constants';
import { FileModel } from '../types/fileModel';
import { Request, Readable } from '../types/request';
import { Response } from '../types/response';

export default class FileController {

    private _fileModel: FileModel;
    private _fileSystem: FileSystem;

    constructor(fileModel: FileModel, pathToImgs: string) {
        this._fileModel = fileModel;
        this._fileSystem = new FileSystem(pathToImgs);
    }

    private async handleFileUpload (file: Readable, h: Response) {
        try {
            const { filename } = file.hapi;
            const data = file._data;
            const isExist = this._fileSystem.isExist(filename);
            if (isExist) {
                return h.badRequest(ClientError.fileAlreadyExists);
            }
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

    public async getListOfFiles(req: Request, h: Response) {
        try {
            const files = await this._fileModel.findAll();
            return h.response(files).code(200);
        }  catch (err) {
                return h.badImplementation();
        }
    }

    public async getViewOfListOfFiles(req: Request, h: Response) {
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

    public async saveLogo(req: Request, h: Response) {
        const { logo } = req.payload;
        return this.handleFileUpload(logo, h);
    }

    public async saveJob(req: Request, h: Response) {
        const { file } = req.payload;
        return this.handleFileUpload(file, h);
    }

    public async updateFile(req: Request, h: Response) {
        try {
            const {id, newFilename} = req.payload;
            const response = await this._fileModel.findOne({where: { id }});
            if (response === null) {
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

    public async deleteFile(req: Request, h: Response) {
        try {
            const { id } = req.payload;
            const response = await this._fileModel.findOne({where: {id}});
            if (response === null) {
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