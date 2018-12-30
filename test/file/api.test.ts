import { expect } from 'chai';
import streamToPromise from 'stream-to-promise';
import { Sequelize } from 'sequelize';
import startServer from '../init';
import { file, newUser } from '../mocks/data';
import { createFormData, appendFiles } from '../utils';
import { ClientError } from '../../src/constants';
import { Server } from '../../src/types/server';
import { createUrl } from '../../src/utils/file';
import FormData from 'form-data';
import { ServerConfigurations } from '../../src/configurations';

describe('app', () => {

    let server: Server;
    let url: string;
    let serverConfigs: ServerConfigurations;
    let dbConn: Sequelize;
    let token: string;

    const getAllFiles = async () => 
        server.inject({
            method: 'GET',
            url: url + '/files',
            headers: { authorization: token }
        });
    
    const uploadLogo = async (payload: Buffer, headers: FormData.Headers) => 
        server.inject({
            method: 'POST',
            url: url + '/files/logo',
            payload,
            headers: { ...headers, authorization: token }
        });
    
    const uploadJob = async (payload: Buffer, headers: FormData.Headers) => 
        server.inject({
            method: 'POST',
            url: url + '/files/jobs',
            payload,
            headers: { ...headers, authorization: token }
        });
    
    const updateFile = async (payload: object) => 
        server.inject({
            method: 'PUT',
            url: url + '/files',
            payload,
            headers: { authorization: token }
        });

    const deleteFile = async (payload: object) => 
        server.inject({
            method: 'DELETE',
            url: url + '/files',
            payload,
            headers: {  authorization: token }
        });

    const clearDb = async (db: Sequelize) => {
        db.query('DROP TABLE files;');
        db.query('DROP TABLE users;');
    };
    
    before(async () => {
        ({ server, serverConfigs, dbConn } = await startServer());
        url = createUrl();

        const res = await server.inject({
            method: 'POST',
            url: url + '/auth/register',
            payload: newUser
        });

        ({ token } = JSON.parse(res.payload));
    });

    it('GET /files - Should return list of all files and return 200', async () => {
        const response = await getAllFiles();
        const parsedPayload = JSON.parse(response.payload);
        
        expect(response.statusCode).to.equal(200);
        expect(parsedPayload).to.be.an("array");
    });

    // /users/logo - only images

    it('POST /users/logo -Should upload valid format logo and return 201', async () => {
        const formData = createFormData();
        appendFiles(formData, file.filenames[0], 'logo'); // .png

        const payload = await streamToPromise(formData);
        const headers = formData.getHeaders();

        const response = await uploadLogo(payload, headers);
        const parsedPayload = JSON.parse(response.payload);

        expect(response.statusCode).to.equal(201);
        expect(parsedPayload).to.have.property("message");
    });

    it('POST /users/logo -Should upload invalid format logo and return 422', async () => {
        const formData = createFormData();
        appendFiles(formData, file.filenames[1], 'logo'); // .doc

        const payload = await streamToPromise(formData);
        const headers = formData.getHeaders();

        const response = await uploadLogo(payload, headers);
        const parsedPayload = JSON.parse(response.payload);

        expect(parsedPayload.statusCode).to.equal(422);
        expect(parsedPayload.message).to.equal(ClientError.invalidFileFormat);
    });

    it('POST /users/logo -Should upload a file that already exists and return 400', async () => {
        const formData = createFormData();
        appendFiles(formData, file.filenames[0], 'logo'); // .png

        const payload = await streamToPromise(formData);
        const headers = formData.getHeaders();

        const response = await uploadLogo(payload, headers);
        const parsedPayload = JSON.parse(response.payload);

        expect(parsedPayload.statusCode).to.equal(400);
        expect(parsedPayload.message).to.equal(ClientError.fileAlreadyExists);
    });


    it('POST /users/logo - Should download logo with too large size, returns 413', async () => {
        const formData = createFormData();
        appendFiles(formData, file.filenames[2], 'logo');

        const payload = await streamToPromise(formData);
        const headers = formData.getHeaders();

        const response = await uploadLogo(payload, headers);
        
        expect(response.statusCode).to.equal(413);
    });

    // /users/jobs -only docs

    it('POST /users/jobs -Should upload valid format file and return 201', async () => {
        const formData = createFormData();
        appendFiles(formData, file.filenames[1]); // .doc

        const payload = await streamToPromise(formData);
        const headers = formData.getHeaders();

        const response = await uploadJob(payload, headers);
        const parsedPayload = JSON.parse(response.payload);

        expect(response.statusCode).to.equal(201);
        expect(parsedPayload).to.have.property("message");
    });

    it('POST /users/jobs -Should upload invalid format file and return 422', async () => {
        const formData = createFormData();
        appendFiles(formData, file.filenames[4]); // .odt

        const payload = await streamToPromise(formData);
        const headers = formData.getHeaders();

        const response = await uploadJob(payload, headers);
        const parsedPayload = JSON.parse(response.payload);

        expect(parsedPayload.statusCode).to.equal(422);
        expect(parsedPayload.message).to.equal(ClientError.invalidFileFormat);
    });

    it('POST /users/jobs - Should download file with too large size, returns 413', async () => {
        const formData = createFormData();
        appendFiles(formData, file.filenames[2]); // large image

        const payload = await streamToPromise(formData);
        const headers = formData.getHeaders();

        const response = await uploadJob(payload, headers);
        
        expect(response.statusCode).to.equal(413);
    });

    // common for all routes

    it('PUT /files - Should update name of a file previously uploaded file and return 200', async () => {
        const response = await updateFile(file.fileToBeUpd);
        
        expect(response.statusCode).to.equal(200);
        expect(response.request.payload).to.include(file.fileToBeUpd);
    });

    it('PUT /files - Should update non-existing file and return 400', async () => {
        const response = await updateFile({...file.fileToBeUpd, id: 666});
        const parsedPayload = JSON.parse(response.payload);

        expect(parsedPayload.statusCode).to.equal(400);
        expect(parsedPayload.message).to.equal(ClientError.fileNotExists);
    });

    it('DELETE /files - Should delete a file previously uploaded and return 200', async () => {
        const response = await deleteFile({id: file.fileToBeDel.id});
        const parsedPayload = JSON.parse(response.payload);

        expect(response.statusCode).to.equal(200);
        expect(parsedPayload).to.have.property("message");
    });

    it('DELETE /files - Should delete non-existing file and return 400', async () => {
        const response = await deleteFile({id: file.badId});
        const parsedPayload = JSON.parse(response.payload);
        expect(parsedPayload.statusCode).to.equal(400);
        expect(parsedPayload.message).to.equal(ClientError.fileNotExists);
    });

    after(async () => {
        clearDb(dbConn);
    });
});