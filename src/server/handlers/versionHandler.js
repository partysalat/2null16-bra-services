'use strict';
var packageInfo = require('pkginfo');
var noble = require("./../bluetooth/support/noble");
var path = require("path");
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
var gm = require("gm");
var IMAGE_FILE_PREFIX = path.resolve(process.env.HOME + "/braimages") + "/";
function resizeImage(img) {
  return new Promise(function(resolve,reject){
    var newFileName = img.filename.substring(0, img.filename.length - 4)+"_min" + ".jpg";
    gm(IMAGE_FILE_PREFIX + img.filename)
      .resize(640, 480)
      .noProfile()
      .write(IMAGE_FILE_PREFIX + newFileName, function (err) {
        if(err){
          return reject(err);
        }
        resolve({
          filename:newFileName
        });
      });
  });
  
}
var cameraActiveFlag = false;
module.exports.captureImage = function (request, reply) {
  if(cameraActiveFlag){
    console.log("photo already in progress");
    reply("ok");
    return;
  }
  cameraActiveFlag = true;
  new GPhoto().captureImageAndDownload({filename: IMAGE_FILE_PREFIX + Date.now() + ".jpg"})
    
    .then(resizeImage)
    .then(function(data){
      cameraActiveFlag = false;
      reply(data);
    })
    .catch(function (err) {
      console.log(err);
      cameraActiveFlag = false;
      reply("Could not capture image").code(500);
    });

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
