var
  gulp = require('gulp'),
  sequence = require('run-sequence'),
  requireDir = require('require-dir');

requireDir('./gulp/tasks', {
  recurse: true
});

gulp.task('clean', ['_clean']);

gulp.task('lint', ['_lint']);

gulp.task('unit', function(done){
  sequence(
    '_unit:server',
    done
  );
});

gulp.task('integration', function(done){
  sequence(
    '_integration',
    done
  );
});

gulp.task('functional', function(done){
  sequence(
    ['_env:set_test','_clean:assets'],
    ['_scripts:copy_mocks',"_scripts"],
    '_functional:browser',
    done
  );
});

gulp.task('smoke', ['_smoke']);

gulp.task('run', function (done) {
  sequence(
    '_server',
    done
  );
});

gulp.task('build', function (done) {
  sequence(
    '_lint:fail',
    //'_unit:server:fail',
    //'_integration',
    //'_functional:server',
    done
  );
});

gulp.task('test', ['build']);

gulp.task('default', function(done){
  sequence(
    '_watch',
    '_server',
    ['_lint', '_unit:server'],
    done
  )

});