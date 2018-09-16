const CSV = require("csvtojson");
const fs = require('fs');

process.on('message', ({ data, name }) => {
    let bufferData = new Buffer(data, 'binary');
    let filePath = `./temp/${name}`;
    fs.appendFileSync(filePath, ''); // create file if it doesn't exist
    fs.writeFileSync(filePath, bufferData);
    _parseCSV(filePath).then(res => {
        console.log("finished");
        process.send({ data: res });
    }, err => { process.exit(1) });
});

function _parseCSV(path) {
    return new Promise((resolve, reject) => {
        let arr = [];
        CSV()
            .fromFile(path)
            .preFileLine((fileLineString, lineIdx) => {
                process.send({ line: lineIdx });
                return fileLineString;
            })
            .subscribe((jsonObj)=>{
                arr.push(jsonObj);
            })
            .on('done', (error) => {
                if (error) {
                    process.send({ error });
                    return reject(error);
                }
                process.send({ data: JSON.stringify(arr) });
                resolve(JSON.stringify(arr));
            })
    })
}