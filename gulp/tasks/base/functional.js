var
  gulp = require('gulp'),
  gutil = require('gulp-util'),
  jasmine = require('gulp-jasmine'),
  server = require('gulp-develop-server'),
  gulpConfig = require('../../config'),
  sequence = require('run-sequence'),

  reporters = require("./reporters"),

  SRC = {
    functional_test: gulpConfig.paths.test.functionalServer + '/**/*'
  };

function stopServer(done) {
  if(server){
    server.kill('SIGTERM',done || function () {
    });
  }

}
gulp.task("_functional:server:stop",function(done){
  stopServer(done);
});
gulp.task('_functional:server:start', function (done) {
  server.listen({
    path: gulpConfig.appName,
    delay: 0,
    env: {
      NODE_ENV: 'test'
    },
    successMessage: /server_started/
  }, done);
});

gulp.task('_functional:server:run', function () {
  gutil.log(gutil.colors.green("FUNCTIONAL SERVER STARTED"));
  return gulp
    .src(SRC.functional_test)
    .pipe(jasmine({
      reporter: reporters.getReporters(),
      verbose: true,
      includeStackTrace: true
    }))
    .on('error', function () {
      stopServer();
    });

});

gulp.task('_functional:server', function (done) {
  sequence(  
    '_functional:server:start', '_functional:server:run','_functional:server:stop', done);
});