'use strict';
var spawn = require("child_process").spawn,
  joi = require("joi"),
  _ = require("lodash");
var commands = [
  "captureImage",
  "captureImageAndDownload",
  "capturePreview",
  "abilities",
  "autoDetect",
  "listCameras",
  "summary",
  ];
var settingsSchema = joi.object().keys({
  folder: joi.string(),
  filename: joi.string().default(getFileName, "actual timestamp"),
  quiet:joi.boolean()
});


function GPhoto(settings) {
  if (!(this instanceof GPhoto)) {
    return new GPhoto(settings);
  }
  this.settings = settings || {};
}

_.forIn(commands, function (key) {
  GPhoto.prototype[key] = function (settings) {
    var res = joi.validate(settings, settingsSchema);
    if (res.error) {
      return Promise.reject(res.error);
    }
    var defaultSettings = {};
    //set method name
    defaultSettings[key] = true;
    _.extend(defaultSettings, res.value, settings);
    if (this.settings.asStream) {
      defaultSettings.stdout = true;
    }

    var commands = [];
    _.forIn(defaultSettings, function (value, key) {
      commands.push("--" + _.kebabCase(key));
      if ((value && typeof value !== "boolean") || value === 0) {
        commands.push(value);
      }
    });
    return spawnGphoto(commands, this.settings.asStream);
  };
});
GPhoto.prototype.asStream = function () {
  this.settings.asStream = true;
  return this;
};


var jobQueue = Promise.resolve();
function spawnGphoto(commands, asStream) {
  if (!asStream) {
    jobQueue = jobQueue.catch(function (err) {
      console.log("Error occured", err);
    }).then(function () {
      return new Promise(function (resolve, reject) {
        var childProcess = spawn("gphoto2", commands);
        childProcess.on('close', function (code) {
          return code ? reject(code) : resolve();
        });
        childProcess.on('error', function (err) {
          console.log("error", err);
        });
        childProcess.stdout.on('data', function (err) {
          console.log("data", err.toString("utf8"));
        });
      });
    });
    return jobQueue;
  } else {
    var childProcess = spawn("gphoto2", commands);
    childProcess.stdout.on("data",console.log);
    return childProcess.stdout;
  }
}
function getFileName() {
  return Date.now() + ".jpg";
}
module.exports = GPhoto;