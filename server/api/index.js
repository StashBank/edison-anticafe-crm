const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');
const jsFileExt = '.js'
let serviceNames;

fs.readdir(__dirname, (err, files) => {
    if (err) {
        throw err;
    }

    serviceNames = files.filter((file) => {
        return path.extname(file) === jsFileExt && file !== 'index.js';
    }).map((file) => {
        return path.basename(file, jsFileExt);
    }).forEach((serviceName) => {
        try {
            let service = require('./' + serviceName);
            app.use("/" + serviceName, service);
        } catch (err) {
            console.log(err);
        }
    });
});

app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.json({
        message: err.message,
        error: err
    });
});

app.get('/', (req, res) => {
    res.send(serviceNames);
});

module.exports = app;