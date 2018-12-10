const expect = require("chai").expect;
const startServer = require('../init');
const config = require('../../configurations/config.dev.json');

describe('app', () => {

    let server = undefined;
    
    const getAllFiles = async () => 
        server.inject({
            method: 'GET',
            url: config.workingDir + '/files'
        })
    
    // const deleteFile = async () =>
    //     server.inject({
    //         method: 'DELETE',
    //         url: config.workingDir + '/files'
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

    it('DELETE /files - Should delete a certain file', async () => {

    })
})