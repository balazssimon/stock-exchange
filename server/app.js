"use strict";

const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
const express = require("express");
const path = require("path");
const api = require('./routes/api');
const staticRoot = path.join(__dirname, "/../");
const fs = require('fs');
const mongoose = require('mongoose');
const config = require('./config');


const mongoURI = "mongodb://localhost/stock-exchange";

class Server {
    constructor() {
        console.log('Starting server...');
        this.app = express();
        this.configServer();
        this.routes();
        this.database();
        this.timer();
        console.log('Server started.');
    }
    static bootstrap() {
        return new Server();
    }
    configServer() {
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: true }));
        this.app.use(cookieParser());
        this.app.use("/bower_components", express.static(path.join(__dirname, "/../bower_components")));
        this.app.use("/node_modules", express.static(path.join(__dirname, "/../node_modules")));
        this.app.use("/client", express.static(path.join(__dirname, "/../client/")));
        this.app.use("/", express.static(path.join(__dirname, "/../client/")));
        this.app.use(function (err, req, res, next) {
            console.log("Request: " + req);
            console.log("Error: " + err);
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

            fs.createReadStream(staticRoot + '/client/index.html').pipe(res);
        });
    }
    routes() {
        this.app.use('/api', api);  
    }
    database() {
        mongoose.connection.on("open", function(ref) {
            console.log("Connected to mongo server.");
            //return start_up();
        });

        mongoose.connection.on("error", function(err) {
            console.log("Could not connect to mongo server!");
            return console.log(err);
        });
        
        // When the connection is disconnected
        mongoose.connection.on('disconnected', function () {  
            console.log('Mongoose default connection disconnected.'); 
        });

        /* 
        * Mongoose by default sets the auto_reconnect option to true.
        * We recommend setting socket options at both the server and replica set level.
        * We recommend a 30 second connection timeout because it allows for 
        * plenty of time in most operating environments.
        */
        var options = { server: { socketOptions: { keepAlive: 300000, connectTimeoutMS: 30000 } }, 
                        replset: { socketOptions: { keepAlive: 300000, connectTimeoutMS : 30000 } } };

        config.Mongoose = mongoose.connect(mongoURI, options);
    }
    timer() {
        setInterval(function(){
            config.Play.run();
        }, 10 * 1000);  
    }
}
var server = Server.bootstrap();
module.exports = server.app;
