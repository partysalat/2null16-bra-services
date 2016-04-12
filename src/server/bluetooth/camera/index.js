'use strict';
var _ = require("lodash"),
  GPhoto = require("./gphoto"),
  braClient = require("./../../clients/braClient"),
  noble = require("noble"),
  path = require("path");

var connected = {};

function init() {
  console.log("INIT CAMERA");
  noble.on("discover", onDiscover);
}

function onDiscover(peripheral) {
  var macAddress = peripheral.uuid;
  if (_.get(peripheral,"advertisement.localName")==="ITAG") {
    connected[macAddress] = true;
    console.log("DISCOVER", macAddress);
    peripheral.connect(_.partial(onConnect, peripheral));
    peripheral.once('disconnect', _.partial(onDisconnect, macAddress, peripheral));
  }
}

function onConnect(peripheral) {
  console.log("CONNECTED", peripheral.uuid);
  peripheral.discoverSomeServicesAndCharacteristics(["ffe0"], ["ffe1"], function (error, services, chars) {
    var char = chars[0];
    char.notify(true);

    char.on("data", onButtonClicked);
  });
}

function onDisconnect(macAddress, peripheral) {
  console.log("DISCONNECTED", macAddress);
  connected[macAddress] = false;
  onDiscover(peripheral);//try to reconnect


}

function onButtonClicked() {
  console.log("PHOTO SHOT!");
  new GPhoto().captureImageAndDownload({filename: path.resolve(__dirname + "/../../../../../../braimages/") + Date.now() + ".jpg"})
    .then(function(img){
      braClient.photoTaken(img.filename);
    });
}

module.exports.init = init;