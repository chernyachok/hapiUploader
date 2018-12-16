const File = require('../db/models/file');
const FileController = require('./controller');
const initRoutes = require('./routes');

module.exports = async (server, connectionDb, staticF) => {
    const fileModel = await File(connectionDb);
    const fileController = new FileController(fileModel, staticF);
    server.bind(fileController);
    await initRoutes(server, fileController, staticF);

    return true;
}