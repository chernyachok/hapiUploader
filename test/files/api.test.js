const expect = require("chai").expect;
const streamToPromise = require('stream-to-promise');
const startServer = require('../init');
const { file } = require('../mocks/data');
const { createFormData, appendFiles } = require('../utils');

describe('app', () => {

    let server = undefined;
    let url = undefined;
    let connectionDb = undefined;

    const getAllFiles = async () => 
        server.inject({
            method: 'GET',
            url: url + '/files',
        });
    
    const uploadFile = async (payload, headers) => 
        server.inject({
            method: 'POST',
            url: url + '/files',
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
        ({server, url, connectionDb} = await startServer());
    })

    it('GET /files - Should return list of all files and return 200', async () => {
        const response = await getAllFiles();
        const parsedPayload = JSON.parse(response.payload);
        expect(response.statusCode).to.equal(200);
        expect(parsedPayload).to.be.an("array");
    })

    it('POST /files -Should upload file and return 201', async () => {
        const formData = createFormData();
        appendFiles(formData, file.filenames.valid);

        const payload = await streamToPromise(formData);
        const headers = formData.getHeaders();

        const response = await uploadFile(payload, headers);
        const parsedPayload = JSON.parse(response.payload);

        expect(response.statusCode).to.equal(201);
        expect(parsedPayload).to.have.property("message");
    })

    it('PUT /files - Should update name of a certain file', async () => {
        const response = await updateFile(file.fileToBeUpd);
        
        expect(response.statusCode).to.equal(200);
        expect(response.request.payload).to.include(file.fileToBeUpd);
    })

    it('DELETE /files - Should delete a certain file and return 200', async () => {
        const response = await deleteFile({id: file.fileToBeDel.id});
        const parsedPayload = JSON.parse(response.payload);

        expect(response.statusCode).to.equal(200);
        expect(parsedPayload).to.have.property("message");
    })

    it('POST /files - Should download file with too large size, returns 413', async () => {
        const formData = createFormData();
        appendFiles(formData, file.filenames.inValid);

        const payload = await streamToPromise(formData);
        const headers = formData.getHeaders();

        const response = await uploadFile(payload, headers);
        
        expect(response.statusCode).to.equal(413);
    })

    after(async () => {
        clearDb(connectionDb);
    })
})