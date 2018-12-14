const Sequelize = require('sequelize');

module.exports = (connection) => {
    const File = connection.define('file', {
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
    
    return File;
}
