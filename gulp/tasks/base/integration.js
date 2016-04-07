'use strict';

var
  gulp = require('gulp'),
  gutil = require('gulp-util'),
  reporters = require('./reporters'),
  jasmine = require('gulp-jasmine'),
  gulpConfig = require('../../config');


var SRC = {
  integrationTest: gulpConfig.paths.test.integration + '/**/*Spec.*'
};


gulp.task('_integration', function () {
  gutil.log(gutil.colors.green("INTEGRATION STARTED"));
  return gulp.src(SRC.integrationTest).pipe(jasmine({
    reporter: reporters.getReporters(),
    verbose: false,
    includeStackTrace: true
  }))
});

