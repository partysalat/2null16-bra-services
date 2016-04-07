/*jslint node: true*/
"use strict";

var
  logger = console,
  Hoek = require('hoek');

// init
// init and configure server
process.title = "2null16-bra";


require('./src/server').create({
  port: 1338,
  routes: {
    state: {
      failAction: 'log'
    }
  }
},function(err,server){
  if(err){
    logger.error('2null16-bra failed to start: ', err);
    throw err;
  }
  server.start(function (startupError) {
    Hoek.assert(!startupError, startupError);
    logger.info('2null16-bra running at: ', server.info.uri);

    if (process.send) {
      process.send('server_started');
    }
  });
});

process.on('SIGINT', function() {
  // My process has received a SIGINT signal
  // Meaning PM2 is now trying to stop the process

  // So I can clean some stuff before the final stop

  setTimeout(function() {
    // 300ms later the process kill it self to allow a restart
    process.exit(0);
  }, 300);
});