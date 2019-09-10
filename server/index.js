/**
 *
 */

`use strict`;

require('dotenv').config();

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const maxmind = require('maxmind');

const app = express();
const port = 3001;
const cityLookup = './db/geolite2-city/data.mmdb';
// const countryLookup = './db/geolite2-country/data.mmdb';  // not required, city lookup yields this info
const defaultLocale = 'en';
const corsOptions = {
    origin: [
        process.env.CLIENT_SERVER,
    ],
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
};

import {asyncMiddleware} from "./modules/middleware.modules";

app.use(bodyParser.json({limit: '50mb', extended: true}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

app.use(cors());

app.options(`/api/testping`, cors(corsOptions));
app.get(`/api/testping`, asyncMiddleware(async (req, res, next) => {
    res.sendStatus(200);
}));

app.options(`/api/clientinfo`, cors(corsOptions));
app.get(`/api/clientinfo`, cors(), asyncMiddleware(async (req, res, next) => {
    let lookup = await maxmind.open(cityLookup);
    let params = req.query;
    let ip = params.ip;
    let locale = params.locale != null ? params.locale : defaultLocale;
    let r = lookup.get(ip);
    let data = {city: r.city.names[locale], isoCode: r.country.iso_code};
    res.send(data)
}));

app.options(`/api/testuploadspeed`, cors(corsOptions));
app.post(`/api/testuploadspeed`, cors(), asyncMiddleware(async (req, res, next) => {
    res.sendStatus(200);
}));

app.listen(port, () => console.log(`app listening on port ${port}`));