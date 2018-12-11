const expect = require("chai").expect;
const fs = require('fs');
const FormData = require('form-data');
const streamToPromise = require('stream-to-promise')
const startServer = require('../init');
const data = require('../mocks/data');

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
        const fileStream =  fs.createReadStream(process.cwd() + '/test/mocks/' + data.fileName)
        const form = new FormData();
        form.append('file', fileStream);
        const payload = await streamToPromise(form);
        const headers = form.getHeaders();

        const response = await uploadFile(payload, headers);
        const parsedPayload = JSON.parse(response.payload);

        expect(response.statusCode).to.equal(200);
        expect(parsedPayload).to.have.property("message");
    })

    it('DELETE /files - Should delete a certain file', async () => {
        const response = await deleteFile({fileToBeDeleted: data.fileName});
        const parsedPayload = JSON.parse(response.payload);

        expect(response.statusCode).to.equal(200);
        expect(parsedPayload).to.have.property("message");
    })
})