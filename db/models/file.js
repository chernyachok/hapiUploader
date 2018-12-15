const Sequelize = require('sequelize');

module.exports = async (connection) => {
    const File = connection.define('files', {
        id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        filename: {
            type: Sequelize.STRING,
            allowNull: false
        },
        url: {
            type: Sequelize.STRING,
            allowNull: false
        }
    });
    await File.sync();
    return File;
}
