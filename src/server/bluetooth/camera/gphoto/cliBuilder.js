'use strict';
var _ = require("lodash");
module.exports.build = function(settings){
  var commands = [];
  _.forIn(settings, function (value, key) {
    commands.push("--" + _.kebabCase(key));
    if ((value && typeof value !== "boolean") || value === 0) {
      commands.push(value);
    }
  });
  return commands;
};