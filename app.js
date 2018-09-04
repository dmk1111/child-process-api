const express = require('express');
const app = express();
const fs = require('fs');

app.get('/status/:id', (req, res) => {
    let id = req.params.id;
    res.send(id);
});
app.post('/upload', function (req, res) {
    res.sendStatus(202);
});
app.get('/', function (req, res) {
    fs.createReadStream('./static/index.html').pipe(res);
});

app.listen(3000, () => console.log('Example app listening on port 3000!'));