import FileSystem from './fileSystem';
import { getApi, getHtmlString } from './utils';
import { ClientError } from '../../constants';
import { FileModel } from '../../db/types';
import { Request, Readable } from '../../types';
import { Response } from '../../types';
import { ServerConfigurations } from '../../configurations';
import { createUrl } from '../../utils/file';
import { ApiController } from '../apiController';

export default class FileController extends ApiController<FileModel> {

    private _fileSystem: FileSystem;

    constructor(
        fileModel: FileModel,
        configs: ServerConfigurations
    ) {
        super(fileModel, configs);
        this._fileSystem = new FileSystem(this._configs.uploadDir);
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
            const url = createUrl(`/files/${filename}`);
            await this.model.create({
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
            const files = await this.model.findAll();
            return h.response(files).code(200);
        }  catch (err) {
                return h.badImplementation();
        }
    }

    public async getViewOfListOfFiles(req: Request, h: Response) {
        try {
            const url = createUrl('/files');
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
            const response = await this.model.findOne({where: { id }});
            if (response === null) {
                return h.badRequest(ClientError.fileNotExists);
            }
            await this._fileSystem.renameFile(response.dataValues.filename, newFilename);
            const newUrl = createUrl(`/files/${newFilename}`);
            await this.model.update({filename: newFilename, url: newUrl}, {where: {id}});
            return h.response({message: 'updated successfully'}).code(200);
        }  catch (err) {
                return h.badImplementation();
        }
    }

    public async deleteFile(req: Request, h: Response) {
        try {
            const { id } = req.payload;
            const response = await this.model.findOne({where: {id}});
            if (response === null) {
                return h.badRequest(ClientError.fileNotExists);
            }
            await this._fileSystem.removeFile(response.dataValues.filename);
            await this.model.destroy({where: { id }});
            return h.response({message: 'deleted successfully'}).code(200);
        }  catch (err) {
                return h.badImplementation();
        }
    }
}