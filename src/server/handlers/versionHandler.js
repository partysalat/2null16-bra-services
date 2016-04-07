'use strict';
var packageInfo = require('pkginfo');
module.exports = function version(request, reply) {
  var applicationVersion = packageInfo.read(module).package.version;
  reply({Version: applicationVersion});
};

