// 'use strict';

var gulp = require('gulp');
var browserSync = require('browser-sync');
var nodemon = require('gulp-nodemon');

var time = 0;

gulp.task('default', ['browser-sync'], function () {
});

gulp.task('browser-sync', ['nodemon'], function() {
	browserSync.init(null, {
		proxy: "http://localhost:3003",
        files: ["public/**/*.*"],
        port: 7000,
	});
});

gulp.task('nodemon', function (cb) {
    if (time < 1) {
        time++;
        return nodemon({
    	  script: 'server.js'
    	}).on('start', function () {
          cb();
        });

    }

});
