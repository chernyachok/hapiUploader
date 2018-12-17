const File = require('../db/models/file');
const FileController = require('./controller');
const initRoutes = require('./routes');

module.exports = async (server, connectionDb, pathToImgs) => {
    const fileModel = await File(connectionDb);
    const fileController = new FileController(fileModel, pathToImgs);
    server.bind(fileController);
    await initRoutes(server, fileController, pathToImgs);

    return true;
}