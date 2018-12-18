const expect = require("chai").expect;
const streamToPromise = require('stream-to-promise');
const startServer = require('../init');
const { file } = require('../mocks/data');
const { createFormData, appendFiles } = require('../utils');
const { ClientError } = require('../../constants');

describe('app', () => {

    let server = undefined;
    let url = undefined;
    let connectionDb = undefined;

    const getAllFiles = async () => 
        server.inject({
            method: 'GET',
            url: url + '/files',
        });
    
    const uploadLogo = async (payload, headers) => 
        server.inject({
            method: 'POST',
            url: url + '/users/logo',
            payload,
            headers
        });
    
    const uploadJob = async (payload, headers) => 
        server.inject({
            method: 'POST',
            url: url + '/users/jobs',
            payload,
            headers
        });
    
    const updateFile = async (payload) => 
        server.inject({
            method: 'PUT',
            url: url + '/files',
            payload
        });

    const deleteFile = async (payload) => 
        server.inject({
            method: 'DELETE',
            url: url + '/files',
            payload
        });

    const clearDb = async (db) => {
        db.query('DROP TABLE files;');
    }
    
    before(async () => {
        ({ server, url, connectionDb } = await startServer());
    })

    it('GET /files - Should return list of all files and return 200', async () => {
        const response = await getAllFiles();
        const parsedPayload = JSON.parse(response.payload);
        expect(response.statusCode).to.equal(200);
        expect(parsedPayload).to.be.an("array");
    })

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
    })

    it('POST /users/logo -Should upload invalid format logo and return 422', async () => {
        const formData = createFormData();
        appendFiles(formData, file.filenames[1], 'logo'); // .doc

        const payload = await streamToPromise(formData);
        const headers = formData.getHeaders();

        const response = await uploadLogo(payload, headers);
        const parsedPayload = JSON.parse(response.payload);

        expect(parsedPayload.statusCode).to.equal(422);
        expect(parsedPayload.message).to.equal(ClientError.invalidFileFormat);
    })

    it('POST /users/logo -Should upload a file that already exists and return 400', async () => {
        const formData = createFormData();
        appendFiles(formData, file.filenames[0], 'logo'); // .png

        const payload = await streamToPromise(formData);
        const headers = formData.getHeaders();

        const response = await uploadLogo(payload, headers);
        const parsedPayload = JSON.parse(response.payload);

        expect(parsedPayload.statusCode).to.equal(400);
        expect(parsedPayload.message).to.equal(ClientError.fileAlreadyExists);
    })


    it('POST /users/logo - Should download logo with too large size, returns 413', async () => {
        const formData = createFormData();
        appendFiles(formData, file.filenames[2], 'logo');

        const payload = await streamToPromise(formData);
        const headers = formData.getHeaders();

        const response = await uploadLogo(payload, headers);
        
        expect(response.statusCode).to.equal(413);
    })

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
    })

    it('POST /users/jobs -Should upload invalid format file and return 422', async () => {
        const formData = createFormData();
        appendFiles(formData, file.filenames[4]); // .odt

        const payload = await streamToPromise(formData);
        const headers = formData.getHeaders();

        const response = await uploadJob(payload, headers);
        const parsedPayload = JSON.parse(response.payload);

        expect(parsedPayload.statusCode).to.equal(422);
        expect(parsedPayload.message).to.equal(ClientError.invalidFileFormat);
    })

    it('POST /users/jobs - Should download file with too large size, returns 413', async () => {
        const formData = createFormData();
        appendFiles(formData, file.filenames[2]); // large image

        const payload = await streamToPromise(formData);
        const headers = formData.getHeaders();

        const response = await uploadJob(payload, headers);
        
        expect(response.statusCode).to.equal(413);
    })

    // common for all routes

    it('PUT /files - Should update name of a file previously uploaded file and return 200', async () => {
        const response = await updateFile(file.fileToBeUpd);
        
        expect(response.statusCode).to.equal(200);
        expect(response.request.payload).to.include(file.fileToBeUpd);
    })

    it('PUT /files - Should update non-existing file and return 400', async () => {
        const response = await updateFile({...file.fileToBeUpd, id: 666});
        const parsedPayload = JSON.parse(response.payload);

        expect(parsedPayload.statusCode).to.equal(400);
        expect(parsedPayload.message).to.equal(ClientError.fileNotExists);
    })

    it('DELETE /files - Should delete a file previously uploaded and return 200', async () => {
        const response = await deleteFile({id: file.fileToBeDel.id});
        const parsedPayload = JSON.parse(response.payload);

        expect(response.statusCode).to.equal(200);
        expect(parsedPayload).to.have.property("message");
    })

    it('DELETE /files - Should delete non-existing file and return 400', async () => {
        const response = await deleteFile({id: file.badId});
        const parsedPayload = JSON.parse(response.payload);
        expect(parsedPayload.statusCode).to.equal(400);
        expect(parsedPayload.message).to.equal(ClientError.fileNotExists);
    })

    after(async () => {
        clearDb(connectionDb);
    })
})