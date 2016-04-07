var
  gulp = require('gulp'),
  config = require('../../config'),

  SRC = {
    jsFiles: [config.appName, config.paths.serverSource + '/**/*.js'],
    serverJadeFiles: config.paths.serverSource + '/**/*.jade',
    unit_test: config.paths.test.unitServer + '/**/*'
  };

gulp.task('_watch', function () {
  return gulp
    .watch(
    [SRC.jsFiles, SRC.unit_test,SRC.serverJadeFiles],
    ['_lint', '_unit:server',"_server:restart"]
  );
});