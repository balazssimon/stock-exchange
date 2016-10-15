# Creating the MEAN project

## Installing npm packages
```
npm init
npm install --save-dev browser-sync gulp gulp-nodemon gulp-tsc morgan nodemon typescript typings
npm install --save body-parser cookie-parser express mime mongodb mongoose path serve-favicon @angular/common @angular/compiler @angular/core @angular/forms @angular/http @angular/platform-browser @angular/platform-browser-dynamic @angular/router @angular/upgrade core-js reflect-metadata rxjs@5.0.0-beta.12 systemjs zone.js
typings install --save --global env~node dt~mongoose dt~core-js dt~jasmine
typings install --save npm~express npm~mongodb

bower init
bower install --save bootstrap ng2-bootstrap
```

## Running the server

To run the server:
```
npm start
```


## Configuring debug

To automatically refresh files, click the **File > Preferences > Keyboard Shortcuts** menu, and insert the following code into the **keybindings.json** file:
```
[
    {
        "key": "ctrl+s",          
        "command": "workbench.action.tasks.build" 
    }
]
```

Create **gulpfile.js**:
```
'use strict';

var gulp = require('gulp');
var browserSync = require('browser-sync');
var nodemon = require('gulp-nodemon');

gulp.task('default', ['nodemon'], function () {
});

gulp.task('nodemon', function (cb) {
	
	var started = false;
	
	return nodemon({
		script: 'server/bin/www'
	}).on('start', function () {
		// to avoid nodemon being started multiple times
		// thanks @matthisk
		if (!started) {
			cb();
			started = true; 
			browserSync.init(null, {
				proxy: "http://localhost:3000",
				files: ["client/**/*.*"],
				browser: "c:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
				port: 7000,
			});
		} 
	});
});
```

To run in debug mode type:
```
gulp
```
If Chrome cannot be started make sure to correct the path inside **gulpfile.js**.

## Creating server files

Create **server/bin/www**:
```
#!/usr/bin/env node
"use strict";

//module dependencies.
var app = require("../app");
var debug = require("debug")("express:server");
var http = require("http");

//get port from environment and store in Express.
var port = normalizePort(process.env.PORT || 3000);
app.set("port", port);


//create http server
var server = http.createServer(app);

//listen on provided ports
server.listen(port);

//add error handler
server.on("error", onError);

//start listening on port
server.on("listening", onListening);


/**
 * Normalize a port into a number, string, or false.
 */
function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */
function onError(error) {
  if (error.syscall !== "listen") {
    throw error;
  }

  var bind = typeof port === "string"
    ? "Pipe " + port
    : "Port " + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use");
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */
function onListening() {
  var addr = server.address();
  var bind = typeof addr === "string"
    ? "pipe " + addr
    : "port " + addr.port;
  debug("Listening on " + bind);
} 
```


Create **server/routes/api.ts**:
```
var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/res', function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router; 
```


Create **server/app.js**:
```
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
```

## Creating client files

Create **client/index.html**:
```
<html>
  <head>
    <base href="/"> 
    <title>Angular QuickStart</title>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link href="bower_components/bootstrap/dist/css/bootstrap.min.css" rel="stylesheet">
    <!-- 1. Load libraries -->
     <!-- Polyfill(s) for older browsers -->
    <script src="node_modules/core-js/client/shim.min.js"></script>
    <script src="node_modules/zone.js/dist/zone.js"></script>
    <script src="node_modules/reflect-metadata/Reflect.js"></script>
    <script src="node_modules/systemjs/dist/system.src.js"></script>
    <!-- 2. Configure SystemJS -->
    <script src="systemjs.config.js"></script>
    <script>
      System.import('app').catch(function(err){ console.error(err); });
    </script>
  </head>
  <!-- 3. Display the application -->
  <body>
<nav class="navbar navbar-inverse">
  <div class="container-fluid">
    <div class="navbar-header">
      <button type="button" class="navbar-toggle" data-toggle="collapse" data-target="#myNavbar">
        <span class="icon-bar"></span>
        <span class="icon-bar"></span>
        <span class="icon-bar"></span>                        
      </button>
      <a class="navbar-brand" href="#">Logo</a>
    </div>
    <div class="collapse navbar-collapse" id="myNavbar">
      <ul class="nav navbar-nav">
        <li class="active"><a href="#">Home</a></li>
        <li><a href="#">About</a></li>
        <li><a href="#">Projects</a></li>
        <li><a href="#">Contact</a></li>
      </ul>
      <ul class="nav navbar-nav navbar-right">
        <li><a href="#"><span class="glyphicon glyphicon-log-in"></span> Login</a></li>
      </ul>
    </div>
  </div>
</nav>
  
<div class="container-fluid text-center">    
  <div class="row content">
    <div class="col-sm-2 sidenav">
      <p><a href="#">Link</a></p>
      <p><a href="#">Link</a></p>
      <p><a href="#">Link</a></p>
    </div>
    <div class="col-sm-8 text-left"> 
      <my-app>Loading...</my-app>
    </div>
    <div class="col-sm-2 sidenav">
      <div class="well">
        <p>ADS</p>
      </div>
      <div class="well">
        <p>ADS</p>
      </div>
    </div>
  </div>
</div>

<footer class="container-fluid text-center">
  <p>Footer Text</p>
</footer>
  </body>
</html>
```


Create **client/systemjs.config.js**:
```
/**
 * System configuration for Angular samples
 * Adjust as necessary for your application needs.
 */
(function (global) {
  System.config({
    paths: {
      // paths serve as alias
      'npm:': 'node_modules/'
    },
    // map tells the System loader where to look for things
    map: {
      // our app is within the app folder
      app: 'client',
      // angular bundles
      '@angular/core': 'npm:@angular/core/bundles/core.umd.js',
      '@angular/common': 'npm:@angular/common/bundles/common.umd.js',
      '@angular/compiler': 'npm:@angular/compiler/bundles/compiler.umd.js',
      '@angular/platform-browser': 'npm:@angular/platform-browser/bundles/platform-browser.umd.js',
      '@angular/platform-browser-dynamic': 'npm:@angular/platform-browser-dynamic/bundles/platform-browser-dynamic.umd.js',
      '@angular/http': 'npm:@angular/http/bundles/http.umd.js',
      '@angular/router': 'npm:@angular/router/bundles/router.umd.js',
      '@angular/forms': 'npm:@angular/forms/bundles/forms.umd.js',
      // other libraries
      'rxjs':                      'npm:rxjs',
      'angular-in-memory-web-api': 'npm:angular-in-memory-web-api',
    },
    // packages tells the System loader how to load when no filename and/or no extension
    packages: {
      app: {
        main: './main.js',
        defaultExtension: 'js'
      },
      rxjs: {
        defaultExtension: 'js'
      },
      'angular-in-memory-web-api': {
        main: './index.js',
        defaultExtension: 'js'
      }
    }
  });
})(this);

```


Create **client/rxjs-extensions.ts**:
```
// Observable class extensions
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/throw';

// Observable operators
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
```


Create **client/main.ts**:
```
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app.module';

const platform = platformBrowserDynamic();

platform.bootstrapModule(AppModule);
```


Create **client/app.module.ts**:
```
import './rxjs-extensions';

import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule }   from '@angular/forms';
import { RouterModule }  from '@angular/router';
import { HttpModule }    from '@angular/http';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent }  from './app.component';


@NgModule({
  imports:      [ 
    BrowserModule,
    FormsModule,
    //AppRoutingModule,
    HttpModule,
  ],
  declarations: [
    AppComponent,
  ],
  bootstrap:    [ AppComponent ],
  providers: [ ]
})
export class AppModule { }
```


Create **client/app-routing.module.ts**:
```
import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  //{ path: '/rrr', redirectTo: '/dashboard', pathMatch: 'full' },
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
```


Create **client/app.component.ts**:
```
import { Component } from "@angular/core";

@Component({
    moduleId: module.id,
    selector: 'my-app',
    template: `
    <h1>{{title}}</h1>
    hello123367<br>
    world2233<br>
    <input [(ngModel)]="title" placeholder="name" />
    <button type="submit" class="btn btn-default">Submit</button>
    `
})
export class AppComponent {
  title = 'Angular 2 sample application';

}
```
