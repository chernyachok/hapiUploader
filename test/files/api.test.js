const expect = require("chai").expect;
const fs = require('fs');
const startServer = require('../init');
const workingUrl = require('../../utils/workingUrl');

describe('app', () => {

    let server = undefined;
    
    const getAllFiles = async () => 
        server.inject({
            method: 'GET',
            url: 'http://localhost:8000' + '/files',
        })
    
    const uploadFile = async () =>  {
        // console.log(workingUrl)
        server.inject({
            method: 'POST',
            url: 'http://localhost:8000' + '/files',
            payload: {
                file: fs.createReadStream(process.cwd() + '/test/mocks/php.png')
            }
        })
    }
        
    
    
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
           const response = await uploadFile();
           console.log(response);
    })

    // it('DELETE /files - Should delete a certain file', async () => {
    //     const response = await deleteFile({fileToBeDeleted: 'ruby.png'});
    //     expect(response.statusCode).to.equal(200);
    // })
})