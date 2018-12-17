const file = {
    filenames: {
        valid: ['elephant.png'],
        inValid: [['large.jpg'], ['favicon.ico']]
    },
    fileToBeUpd: {
        id: 1,
        newFilename: 'elephant1.png'
    },
    fileToBeDel: {
        id: 1
    },
    badId: 99
}

module.exports = {
    file
}