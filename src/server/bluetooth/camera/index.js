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
  if (_.get(peripheral, "advertisement.localName") === "ITAG" && !connected[macAddress]) {
    connected[macAddress] = true;
    console.log("DISCOVER", macAddress);
    peripheral.connect(_.partial(onConnect, peripheral));
    peripheral.once('disconnect', _.partial(onDisconnect, macAddress, peripheral));
  }
}

function onConnect(peripheral) {
  console.log("CONNECTED", peripheral.uuid);
  peripheral.discoverSomeServicesAndCharacteristics(["ffe0"], ["ffe1"], function (error, services, chars) {
    console.log("SERVICE DISCOVERED", services.uuid);
    var char = chars[0];
    char.notify(true);

    char.on("data", onButtonClicked.bind(this,peripheral.uuid));
  });
}

function onDisconnect(macAddress) {
  console.log("DISCONNECTED", macAddress);
  connected[macAddress] = false;
  //onDiscover(peripheral);//try to reconnect


}

function onButtonClicked(uuid) {
  console.log("PHOTO SHOT! for",uuid);
  new GPhoto().captureImageAndDownload({filename: path.resolve(__dirname + "/../../../../../../braimages") + "/" + Date.now() + ".jpg"})
    .then(function (img) {
      //TODO: Implement this!
      return braClient.photoTaken(img.filename,"flo");
    });
}

module.exports.init = init;