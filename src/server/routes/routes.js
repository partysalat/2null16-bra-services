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
  },
  {
    method: 'GET',
    path: '/internal/version/start',
    config: {
      handler: require('../handlers/versionHandler.js').start
    }
  },
  {
    method: 'GET',
    path: '/internal/version/stop',
    config: {
      handler: require('../handlers/versionHandler.js').stop
    }
  },{
    method: 'GET',
    path: '/internal/camera/shot',
    config: {
      handler: require('../handlers/versionHandler.js').captureImage
    }
  },
  {
    method: 'GET',
    path: '/internal/camera/preview',
    config: {
      handler: require('../handlers/versionHandler.js').preview
    }
  }
];


module.exports = routes;