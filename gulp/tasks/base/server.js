var
  gulp = require('gulp'),

  config = require("./../../config"),
  server = require('gulp-develop-server');

gulp.task("_server:restart",function(done){
  server.restart(function(err){
    
    done(err);
  });
});

gulp.task('_server', function (done) {

  process.on('exit', function() {
    server.kill();
  });

  return server.listen({
    path: config.appName,
    delay: 0,
    env: {
      NODE_ENV: process.env.NODE_ENV || 'development'
    },
    successMessage: /server_started/
  },  function(){
    done();
  });
});