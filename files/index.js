const File = require('../db/models/file');
const FileController = require('./controller');
const initRoutes = require('./routes');

module.exports = async (server, pathToImgs) => {
    const fileModel = await File(server.db);
    const fileController = new FileController(fileModel, pathToImgs);
    server.bind(fileController);
    await initRoutes(server, fileController, pathToImgs);

    return true;
}