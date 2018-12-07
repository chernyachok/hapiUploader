const list = require('./list.json');

module.exports = (req, h) => {
        let listOffileNames = '';
        list.files.forEach(item => {
            listOffileNames += (item.src + '<br/>')
        });
        return h.response(listOffileNames).type('text/html');
    }