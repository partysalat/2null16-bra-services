var
  gulp = require('gulp'),
  gutil = require('gulp-util'),
  jasmine = require('gulp-jasmine'),
  reporters = require("./reporters"),
  gulpConfig = require('../../config'),
  istanbul = require('gulp-istanbul'),

//@see https://github.com/SBoudrias/gulp-istanbul/issues/87
  coverageVariable,
  SRC = {
    unit_test: gulpConfig.paths.test.unitServer + '/**/*'
  };


gulp.task('_unit:server:istanbul', function () {
  coverageVariable = '$$cov_' + new Date().getTime() + '$$';
  return gulp.
    src(gulpConfig.paths.serverSource + '/**/*.js')
    .pipe(istanbul( { coverageVariable: coverageVariable }))
    .pipe(istanbul.hookRequire());
});

gulp.task('_unit:server', ['_unit:server:istanbul'], function () {
  return execUnitTests(false);
});
gulp.task('_unit:server:fail', ['_unit:server:istanbul'], function () {
  return execUnitTests(true);
});

function execUnitTests(failOnError) {
  gutil.log(gutil.colors.green("UNIT SERVER STARTED"));

  return gulp
    .src(SRC.unit_test)
    .pipe(jasmine({
      reporter: reporters.getReporters(),
      errorOnFail: failOnError,
      verbose: false,
      includeStackTrace: true
    }))
    .on("error", function (err) {
      if (failOnError) {
        //because gulp istanbul let failed tests to exit with code 0
        process.exit(1);
      }
      this.emit("end", err);
    })
    .pipe(istanbul.writeReports({
      coverageVariable: coverageVariable,
      dir: gulpConfig.paths.coverageServer,
      reporters: ['lcov', 'json']
    }));
}
