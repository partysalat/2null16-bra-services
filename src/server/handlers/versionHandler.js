'use strict';
var packageInfo = require('pkginfo');
var noble =require("./../bluetooth/support/noble");
module.exports = function version(request, reply) {
  var applicationVersion = packageInfo.read(module).package.version;
  reply({Version: applicationVersion});
};

module.exports.start = function (request, reply) {
  noble.start();
  reply("ok");
};
module.exports.stop = function (request, reply) {
  noble.stop();
  reply("ok");
};


var GPhoto = require("./../bluetooth/camera/gphoto");
module.exports.captureImage = function(request,reply){
  new GPhoto().captureImageAndDownload({
    //filename:Date.now()+".jpg"
  }).then(reply).catch(function(err){
    console.log(err);
    reply(err);
  });
};





var stream;

module.exports.preview = function(request,reply){
  if(!stream){
    stream = new GPhoto().asStream().capturePreview();
  }
  //reply(new GPhoto().asStream().capturePreview()).header("content-type","application/octet-stream");
  reply(stream).header("content-type","application/octet-stream");
};
module.exports.stopPreview = function(request,reply){
  //reply(new GPhoto().asStream().capturePreview()).header("content-type","application/octet-stream");

  reply().header("content-type","application/octet-stream");
};
