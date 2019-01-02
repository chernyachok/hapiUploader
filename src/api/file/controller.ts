import FileSystem from './fileSystem';
import { getApi, getHtmlString } from './utils';
import { ClientError } from '../../constants';
import { FileModel } from '../../db/types';
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

    public async handleFileUpload (filename: string, data: Buffer) {

            const isExist = this._fileSystem.isExist(filename);
            if (isExist) {
                throw (ClientError.fileAlreadyExists);
            }
            await this._fileSystem.writeFile(filename, data);
            const url = createUrl(`/files/${filename}`);
            await this.model.create({
               filename,
               url
            });

            return Promise.resolve();
    }

    public async getListOfFiles() {

            return this.model.findAll();
    }

    public async getViewOfListOfFiles() {
            const url = createUrl('/files');
            const data = await getApi(url);
            return getHtmlString(data);
    }

    public async updateFile(id: number, newFilename: string) {

            const response = await this.model.findOne({where: { id }});
            if (response === null) {
                throw (ClientError.fileNotExists);
            }
            await this._fileSystem.renameFile(response.dataValues.filename, newFilename);
            const newUrl = createUrl(`/files/${newFilename}`);
            await this.model.update({filename: newFilename, url: newUrl}, {where: {id}});
            
            return Promise.resolve();
    }

    public async deleteFile(id: number) {

            const response = await this.model.findOne({where: {id}});
            if (response === null) {
                throw (ClientError.fileNotExists);
            }
            await this._fileSystem.removeFile(response.dataValues.filename);
            await this.model.destroy({where: { id }});
            
            return Promise.resolve();
    }
}