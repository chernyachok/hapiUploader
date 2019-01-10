import { Request, Response, Readable } from '../../types';
import FileController from './controller';
import { ApiReqHandler } from '../apiDal';
import { dalErrorHandler } from '../../utils/decorators';

@dalErrorHandler(true)
export default class FileReqHandler extends ApiReqHandler<FileController> {
    
    private async handleFileUpload (file: Readable, h: Response) {
            const { filename } = file.hapi;
            const data = file._data;
            await this.controller.handleFileUpload(filename, data);
            return h.response({message: 'file uploaded succcesfully'}).code(201);
    }

    public async getListOfFiles(_: Request, h: Response) {

            const files = await this.controller.getListOfFiles();
            return h.response(files).code(200);
    }

    public async getViewOfListOfFiles(_: Request, h: Response) {

            const files = await this.controller.getViewOfListOfFiles();
            return h.response(files)
                .type('text/html')
                .code(200);
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

            const {id, newFilename} = req.payload;
            await this.controller.updateFile(id , newFilename);
            return h.response({message: 'updated successfully'}).code(200);
    }

    public async deleteFile(req: Request, h: Response) {
            const { id } = req.payload;
            await this.controller.deleteFile(id);
            return h.response({message: 'deleted successfully'}).code(200);
    }
}