'use strict';
var _ = require("lodash"),
  GPhoto = require("./gphoto"),
  noble = require("noble");
var MAC_ADDRESSES = [
  "ffff00008185",
  "ffff0000ed2d",
  "ffff00009111",
  "ffff00009c60",
  "2255db705ff8429881f79ac519d36ffd"
];
var connected = {};

function init() {
  noble.on("discover", onDiscover);
}

function onDiscover(peripheral) {
  var macAddress = peripheral.uuid;
  if (_.includes(MAC_ADDRESSES, macAddress) && !connected[macAddress]) {
    connected[macAddress] = true;
    console.log("DISCOVER",macAddress);
    peripheral.connect(_.partial(onConnect, peripheral));
    peripheral.once('disconnect', _.partial(onDisconnect,macAddress,peripheral));
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

function onDisconnect(macAddress,peripheral) {
  console.log("DISCONNECTED",macAddress);
  connected[macAddress] = false;
  onDiscover(peripheral);//try to reconnect

}

function onButtonClicked() {
  console.log("PHOTO SHOT!");
  new GPhoto().captureImageAndDownload({filename:"~/braimages/" + Date.now()+".jpg"})
    .then(console.log);
}

module.exports.init = init;