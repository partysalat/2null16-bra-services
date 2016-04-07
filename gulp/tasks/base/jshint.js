/*jshint strict:false*/
var gulpConfig = require('../../config'),
    jshint = require('gulp-jshint'),

  gulp   = require('gulp');

var
  SRC = {
    jsFiles: [
      gulpConfig.appName,
      gulpConfig.paths.source + '/**/*.js',
      gulpConfig.paths.test.base + '/**/*.js',
      "!"+gulpConfig.paths.source + '/browser/vendor/*.js'
    ]
  };

gulp.task('_lint', function() {
  return lint();
});

gulp.task('_lint:fail', function() {
  return lint()
    .pipe(jshint.reporter('fail'));
});

function lint() {
  return gulp
    .src(SRC.jsFiles)
    .pipe(jshint({
      strict: 'global',
      node: true
    }))
    .pipe(jshint.reporter('jshint-stylish'))
}
