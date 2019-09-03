const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = 3001;

app.use(bodyParser.json({limit: '50mb', extended: true}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

app.get(`/api/testping`, (req, res) => {
    res.sendStatus(200);
});

app.post(`/api/testuploadspeed`, (req, res) => {
    res.sendStatus(200);
});

app.listen(port, () => console.log(`app listening on port ${port}`));