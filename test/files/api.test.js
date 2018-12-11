const expect = require("chai").expect;
const streamToPromise = require('stream-to-promise')
const startServer = require('../init');
const {fileNames} = require('../mocks/data');
const {createFormData, appendFiles} = require('../utils');

describe('app', () => {

    let server = undefined;
    let url = undefined;

    const getAllFiles = async () => 
        server.inject({
            method: 'GET',
            url: url + '/files',
        })
    
    const uploadFile = async (payload, headers) => 
        server.inject({
            method: 'POST',
            url: url + '/files',
            payload,
            headers
        })

    const deleteFile = async (payload) => 
        server.inject({
            method: 'DELETE',
            url: url + '/files',
            payload
        })
    
    before(async () => {
        ({server, url} = await startServer());
    })

    it('GET /files - Should return list of all files and return 200', async () => {
        const response = await getAllFiles()
        const parsedPayload = JSON.parse(response.payload);
        expect(response.statusCode).to.equal(200);
        expect(parsedPayload).to.be.an("array");
    })

    it('POST /files -Should upload file and return 200', async () => {
        const formData = createFormData();
        appendFiles(formData, fileNames);

        const payload = await streamToPromise(formData);
        const headers = formData.getHeaders();

        const response = await uploadFile(payload, headers);
        const parsedPayload = JSON.parse(response.payload);

        expect(response.statusCode).to.equal(200);
        expect(parsedPayload).to.have.property("message");
    })

    it('DELETE /files - Should delete a certain file', async () => {
        const response = await deleteFile({fileToBeDeleted: fileNames[0]});
        const parsedPayload = JSON.parse(response.payload);

        expect(response.statusCode).to.equal(200);
        expect(parsedPayload).to.have.property("message");
    })
})