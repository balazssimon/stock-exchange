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