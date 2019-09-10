/**
 *
 */

`use strict`;

require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const maxmind = require('maxmind');

const app = express();
const port = 3001;
const cityLookup = './db/geolite2-city/data.mmdb';
// const countryLookup = './db/geolite2-country/data.mmdb';  // not required, city lookup yields this info
const defaultLocale = 'en';

import {asyncMiddleware} from "./modules/middleware.modules";

app.use(bodyParser.json({limit: '50mb', extended: true}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

app.get(`/api/testping`, (req, res) => {
    res.sendStatus(200);
});

app.get(`/api/clientinfo`, asyncMiddleware(async (req, res, next) => {
    let lookup = await maxmind.open(cityLookup);
    let params = req.query;
    let ip = params.ip;
    let locale = params.locale != null ? params.locale : defaultLocale;
    let r = lookup.get(ip);
    let data = {city: r.city.names[locale], isoCode: r.country.iso_code};
    res.send(data)
}));

app.post(`/api/testuploadspeed`, (req, res) => {
    res.sendStatus(200);
});

app.listen(port, () => console.log(`app listening on port ${port}`));