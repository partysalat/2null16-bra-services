'use strict';
var _ = require("lodash"),
  noble = require("noble");
var MAC_ADDRESSES = [
  "ffff00008185"
];
var connected = {};

function init() {
  noble.on("discover", onDiscover);
}

function onDiscover(peripheral) {
  var macAddress = peripheral.uuid;
  if (_.includes(MAC_ADDRESSES, macAddress) && !connected[macAddress]) {
    connected[macAddress] = true;
    peripheral.connect(_.partial(onConnect, peripheral));
    peripheral.once('disconnect', _.partial(onDisconnect,macAddress));
  }
}

function onConnect(peripheral) {
  console.log("connected with periphel " + peripheral.uuid);
  peripheral.discoverSomeServicesAndCharacteristics(["ffe0"], ["ffe1"], function (error, services, chars) {
    var char = chars[0];
    char.notify(true);
    char.on("data", onButtonClicked);
  });
}

function onDisconnect(macAddress) {
  delete connected[macAddress];
}

function onButtonClicked() {
  console.log("PHOTO SHOT!");
}

module.exports.init = init;