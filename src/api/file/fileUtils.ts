import axios from 'axios';

import { FileApiResult } from './types';

export const getApi = async (url: string): Promise<Array<FileApiResult>> => {
    const { data } = await axios.get<Array<FileApiResult>>(url);
    return data;
};

export const getHtmlString = (data: Array<FileApiResult>): string => {
    let files = '';
        data.length && data.forEach((item: FileApiResult, index: number) => {
           if (index === 0) {
               let keysArr: string[] = [];
               for (let key in item) {
                if (item.hasOwnProperty(key)) {
                    keysArr.push(key);
                }
               }
               keysArr.forEach((item2: string, index2) => {
                   index2 === 0 ? files = '<tr>' : undefined;
            
                   files += `<th>${item2}</th>`;

                   index2 === (keysArr.length - 1) ? files += '</tr>' : undefined;
               });
           }
           files += `
            <tr>
                <td>${item.id}</td>
                <td>${item.filename}</td>
                <td><a href='${item.url}'>${item.url}</a></td>
            </tr>
           `;
        });
    
    return files ? `<table>${files}</table>` : '<h4>No files available!</h4>';
};
