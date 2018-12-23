import * as jwt from 'jsonwebtoken';
import FileSystem from './fileSystem';
import { workingUrl, getApi, getHtmlString } from './utils';
import { ClientError } from '../constants';
import { FileModel } from '../types/fileModel';
import { Request, Readable } from '../types/request';
import { Response } from '../types/response';
import { UserModel } from '../types/userModel';

export default class FileController {

    private _fileModel: FileModel;
    private _fileSystem: FileSystem;
    private _userModel: UserModel;

    constructor(fileModel: FileModel, userModel: UserModel, pathToImgs: string) {
        this._fileModel = fileModel;
        this._userModel = userModel;
        this._fileSystem = new FileSystem(pathToImgs);
    }

    public async getMe (req: Request, h: Response) {
        const token = req.headers['authorization'];
        if (!token) {
            return h.unauthorized('invalid token');
        }
        try {
            const decoded = jwt.verify(token, 'keyboardcat', {
                algorithms: ['HS256']
            });
            return h.response(decoded);
        } catch (err) {
            console.log(err);
            throw err;
        }
    }

    public async registerToken(req: Request, h: Response) {
        const { username } = req.payload;
        const { dataValues } = await this._userModel.create({
            username
        });
        const token = jwt.sign({ id: dataValues.id, username: dataValues.username }, 'keyboardcat', {
            algorithm: 'HS256'
        });
        return h.response({ auth: true, token});
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