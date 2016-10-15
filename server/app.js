"use strict";

const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
const express = require("express");
const path = require("path");
const api = require('./routes/api');
const staticRoot = path.join(__dirname, "/../");
const fs = require('fs');

class Server {
    constructor() {
        console.log('Starting server...');
        this.app = express();
        this.config();
        this.routes();
        console.log('Server started.');
    }
    static bootstrap() {
        return new Server();
    }
    config() {
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: true }));
        this.app.use(cookieParser());
        this.app.use("/bower_components", express.static(path.join(__dirname, "/../bower_components")));
        this.app.use("/node_modules", express.static(path.join(__dirname, "/../node_modules")));
        this.app.use("/client", express.static(path.join(__dirname, "/../client/")));
        this.app.use("/", express.static(path.join(__dirname, "/../client/")));
        this.app.use(function (err, req, res, next) {
            console.log('Processing request...');

            // if the request is not html then move along
            var accept = req.accepts('html', 'json', 'xml');
            if(accept !== 'html'){
                return next();
            }

            // if the request has a '.' assume that it's for a file, move along
            var ext = path.extname(req.path);
            if (ext !== ''){
                return next();
            }

            fs.createReadStream(staticRoot + 'index.html').pipe(res);
        });
    }
    routes() {
        this.app.use('/api', api);  
    }
}
var server = Server.bootstrap();
module.exports = server.app;
