'use strict';
var cliBuilder = require("./cliBuilder"),
  gphotoCliService = require("./gphotoCliService"),
  joi = require("joi"),
  _ = require("lodash");
var commands = {
  "captureImage": {transform: _.identity},
  "captureImageAndDownload": {
    transform: function (data) {
      if (data) {
        return {
          filename: _(data)
            .map(function (val) {
              return val.toString("utf8");
            })
            .map(function (line) {
              return (line.match(/\/(1.*\.jpg)/) || [])[1];
            })
            .filter(_.identity)
            .first()
        };
      }
      return data;
    }
  },
  "captureMovie": {transform: _.identity},
  "capturePreview": {transform: _.identity},
  "abilities": {transform: _.identity},
  "autoDetect": {transform: _.identity},
  "listCameras": {transform: _.identity},
  "summary": {
    transform: function (data) {
      return data.join("\n");
    }
  }
};
var settingsSchema = joi.object().keys({
  folder: joi.string(),
  filename: joi.string().default(getFileName, "actual timestamp"),
  quiet: joi.boolean(),
  duration: joi.string()
});


function GPhoto(settings) {
  if (!(this instanceof GPhoto)) {
    return new GPhoto(settings);
  }
  this.settings = settings || {};
}

_.forIn(commands, function (value, key) {
  GPhoto.prototype[key] = function (settings) {
    settings = settings || {};
    var res = joi.validate(settings, settingsSchema);
    if (res.error) {
      throw res.error;
    }
    var defaultSettings = {};
    //set method name
    defaultSettings[key] = true;
    _.extend(defaultSettings, res.value, settings);
    this.settings.transform = value.transform;
    this.settings.cliCommands = cliBuilder.build(defaultSettings);
    return this;
  };
});

GPhoto.prototype.asStream = function () {
  return gphotoCliService.spawnGphotoAsStream(this.settings.cliCommands.concat(["--stdout"]));
};

GPhoto.prototype.then = function (callback, errorCb) {
  return gphotoCliService.spawnGphoto(this.settings.cliCommands)
    .then(this.settings.transform)
    .then(callback, errorCb);
};
GPhoto.prototype.catch = function (errorCb) {
  return gphotoCliService.spawnGphoto(this.settings.cliCommands)
    .then(this.settings.transform)
    .catch(errorCb);
};


function getFileName() {
  return Date.now() + ".jpg";
}
module.exports = GPhoto;