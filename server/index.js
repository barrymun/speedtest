const express = require('express');
const bodyParser = require('body-parser');
const geolite2 = require('geolite2');
const maxmind = require('maxmind');

const app = express();
const port = 3001;

import {asyncMiddleware} from "./modules/middleware.modules";

const cityLookup = './db/geolite2-city/data.mmdb';
const countryLookup = './db/geolite2-country/data.mmdb';

app.use(bodyParser.json({limit: '50mb', extended: true}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

app.get(`/api/testping`, (req, res) => {
    res.sendStatus(200);
});

app.get(`/api/clientinfo`, asyncMiddleware(async (req, res, next) => {
    let lookup = await maxmind.open(countryLookup);
    let params = req.query;
    let ip = params.ip;
    console.log({ip})
    var city = lookup.get(ip);
    console.log({city})
    let data = {city}
    res.send(data)
}));

app.post(`/api/testuploadspeed`, (req, res) => {
    res.sendStatus(200);
});

app.listen(port, () => console.log(`app listening on port ${port}`));