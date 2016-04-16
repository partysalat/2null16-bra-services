'use strict';
var rp = require("request-promise"),
  sprintf = require("sprintf-js").sprintf;
module.exports.updateUserState = function(keeperName,status){
  //console.log("updateUserState",keeperName,status);
  return rp({
    method:"PUT",
    url:sprintf("http://localhost:1337/api/keeper/%s/%s",keeperName,status)
  });
};

module.exports.photoTaken = function(imagePath){
  return rp({
    method:"POST",
    url:sprintf("http://localhost:1337/api/photo/%s",imagePath)
  });
};