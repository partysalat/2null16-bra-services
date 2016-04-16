'use strict';
var packageInfo = require('pkginfo');
var noble = require("./../bluetooth/support/noble");
var path = require("path");
var braClient = require("./../clients/braClient");
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
module.exports.captureImage = function (request, reply) {
  new GPhoto().captureImageAndDownload({filename: path.resolve(process.env.HOME + "/braimages") + "/" + Date.now() + ".jpg"})
    .then(reply)
    .catch(function (err) {
      console.log(err);
      reply(err);
    });
  /*reply(new GPhoto().captureMovie({
   "duration":"10s"
   //filename:__dirname + "/"+Date.now()+".jpg"
   }).asStream());*/
};


var stream;

module.exports.preview = function (request, reply) {
  if (!stream) {
    stream = new GPhoto().capturePreview().asStream();
  }
  //reply(new GPhoto().asStream().capturePreview()).header("content-type","application/octet-stream");
  reply(stream).header("content-type", "application/octet-stream");
};
module.exports.stopPreview = function (request, reply) {
  //reply(new GPhoto().asStream().capturePreview()).header("content-type","application/octet-stream");

  reply().header("content-type", "application/octet-stream");
};
