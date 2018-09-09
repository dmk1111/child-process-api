const express = require('express');
const app = express();
const fs = require('fs');
const CSV = require("csvtojson");
const bodyParser = require('body-parser');

const pseudoDb = new Map();

let lastId = 12345;
app.use(bodyParser.json({ limit: '50mb', extended: true }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

app.get('/status/:id', (req, res) => {
    let id = +req.params.id;
    let data = pseudoDb.get(id);
    console.log(id);
    console.log(data);
    res.send({message: {inProgress: data}});
});
app.post('/upload', function (req, res) {
    let name = req.body.name;
    if (!_isCSV(name)) {
        return res.status(503).send("File should have .csv extension");
    }
    let data = new Buffer(req.body.data, 'binary');
    let filePath = `./temp/${name}`;
    fs.appendFileSync(filePath, ''); // create file if it doesn't exist
    fs.writeFileSync(filePath, data);
    _parseCSV(filePath);
    res.status(202).send({ message: 'Accepted', id: lastId });
    lastId += 1;
});
app.use(express.static(__dirname));

app.listen(3000, () => console.log('Example app listening on port 3000!'));

function _parseCSV(path) {
    return new Promise((resolve, reject) => {
        let arr = [];
        CSV()
            .fromFile(path)
            .preFileLine((fileLineString, lineIdx) => {
                pseudoDb.set(12345, { inProgress: true, line: lineIdx });
                console.log(pseudoDb.get(12345));
                console.log(fileLineString);
                return fileLineString;
            })
            .subscribe((jsonObj)=>{
                arr.push(jsonObj);
            })
            .on('done', (error) => {
                if (error) {
                    return reject(error);
                }
                pseudoDb.set(12345, { inProgress: false, data: arr });
                console.log(pseudoDb.get(12345));
                resolve(JSON.stringify(arr));
                console.log(arr);
            })
    })
}

function _isCSV(path) {
    let csvTest = new RegExp(".*\\.csv", "gi");
    return csvTest.test(path);
}