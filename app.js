const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const { fork } = require('child_process');

const pseudoDb = new Map();

let lastId = 12345;
app.use(bodyParser.json({ limit: '50mb', extended: true }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

app.get('/status/:id', (req, res) => {
    let id = +req.params.id;
    let data = pseudoDb.get(id);
    console.log(id);
    res.send({ message: data });
});
app.post('/upload', function (req, res) {
    let name = req.body.name;
    if (!_isCSV(name)) {
        return res.status(503).send("File should have .csv extension");
    }
    convertCsvToJson(req.body.data, name);
    res.status(202).send({ message: 'Accepted', id: lastId });
    lastId += 1;
});
app.use(express.static(__dirname));

app.listen(3000, () => console.log('Example app listening on port 3000!'));

function _isCSV(path) {
    let csvTest = new RegExp(".*\\.csv", "gi");
    return csvTest.test(path);
}

function convertCsvToJson(binaryData, name) {
    let forkedProcess = fork('./csvParser.js');
    forkedProcess.send({ data: binaryData, name });
    forkedProcess.on('message', ({ data, line, error }) => {
        if (line) {
            pseudoDb.set(12345, { inProgress: true, line: line });
        } else if (data) {
            console.log('finished');
            pseudoDb.set(12345, { inProgress: false, data: data });
        } else if (error) {
            console.log(error);
            pseudoDb.set(12345, { inProgress: false, error: error });
        }
    });
    forkedProcess.on('exit', function (code, signal) {
        console.log('child process exited with ' +
            `code ${code} and signal ${signal}`);
    });
}