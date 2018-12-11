const expect = require("chai").expect;
const startServer = require('../init');
const config = require('../../configurations/config.dev.json');

describe('app', () => {

    let server = undefined;
    
    const getAllFiles = async () => 
        server.inject({
            method: 'GET',
            url: config.workingDir + '/files',
        })
    
    const uploadFile = async (payload, headers) => 
    server.inject({
        method: 'POST',
        url: config.workingDir + '/files',
        payload,
        headers
    })
    
    // const deleteFile = async payload =>
    //     server.inject({
    //         method: 'DELETE',
    //         url: config.workingDir + '/files',
    //         payload 
    //     })
    
    before(async () => {
        server = await startServer();
    })

    it('GET /files - Should return list of all files', async () => {
        const response = await getAllFiles()
        const parsedPayload = JSON.parse(response.payload);
        expect(response.statusCode).to.equal(200);
        expect(parsedPayload).to.be.an("array");
    })

    it('POST /files -Should upload valid file', async () => {

    })

    // it('DELETE /files - Should delete a certain file', async () => {
    //     const response = await deleteFile({fileToBeDeleted: 'ruby.png'});
    //     expect(response.statusCode).to.equal(200);
    // })
})