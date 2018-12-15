const File = require('../db/models/file');
const FileController = require('./controller');
const initRoutes = require('./routes');

module.exports = async (server, connection) => {
    const fileModel = await File(connection);
    const fileController = new FileController(fileModel);
    server.bind(fileController);
    await initRoutes(server, fileController);

    return true;
}