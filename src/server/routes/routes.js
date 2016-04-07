'use strict';
var routes = [{
  method: 'GET',
  path: '/internal/status',
  config: {
    handler: require('../handlers/statusHandler.js')
  }
},
  {
    method: 'GET',
    path: '/internal/assets/{filename*}',
    handler: {
      directory: {
        path: __dirname + '/../../../target/assets',
        redirectToSlash: true
      }
    }
  },
  {
    method: 'GET',
    path: '/internal/version',
    config: {
      handler: require('../handlers/versionHandler.js')
    }
  }
];


module.exports = routes;