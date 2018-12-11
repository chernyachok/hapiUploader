const axios = require('axios');

exports.getApi = async (url) => {
    const {data} = await axios.get(url);
    return data;
}

exports.getHtmlString = data => {
    let files = '';
        data.length && data.forEach((item, index) => {
           if (index === 0) {
               let keysArr = [];
               for(key in item) {
                keysArr.push(key);
               }
               keysArr.forEach((item2, index2) => {
                   index2 === 0 ? files = '<tr>': undefined
            
                   files += `<th>${item2}</th>`

                   index2 === (keysArr.length-1)? files += '</tr>' : undefined
               })
           }
           files += `
            <tr>
                <td>${item.id}</td>
                <td>${item.fileName}</td>
                <td><a href='${item.url}'>${item.url}</a></td>
            </tr>
           `;
        });
    
    return files ? `<table>${files}</table>` : '<h4>No files available!</h4>'
}
