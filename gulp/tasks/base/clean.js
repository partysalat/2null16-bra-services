var
  gulp = require('gulp'),
  config = require("./../../config"),
  del = require('del');

gulp.task('_clean', function (done) {
  return del(['./target',config.paths.serverSource + "/config"], done);
});

gulp.task('_clean:assets', function (done) {
  return del(['./target/assets',config.paths.serverSource + "/config"], done);
});