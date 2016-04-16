'use strict';
var rp = require("request-promise"),
  sprintf = require("sprintf-js").sprintf;
module.exports.updateUserState = function(keeperName,payload){
  return rp({
    method:"PUT",
    body:payload,
    json:true,
    url:sprintf("http://localhost:1337/api/keeper/%s",keeperName)
  });
};

module.exports.photoTaken = function(imagePath){
  return rp({
    method:"POST",
    url:sprintf("http://localhost:1337/api/photo/%s",imagePath)
  });
};