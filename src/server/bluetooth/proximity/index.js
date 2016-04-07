'use strict';
var _ = require("lodash"),
  noble = require("noble"),
  proximityService = require("./proximityService");
var MAC_ADDRESSES = [
  "ffff00008185"
];

function init() {
  noble.on("discover", onDiscover);
}

function onDiscover(peripheral) {
  var macAddress = peripheral.uuid;
  var rssi = peripheral.rssi;
  if (_.includes(MAC_ADDRESSES, macAddress)) {
    var distance = proximityService.calcDistance(macAddress,rssi);
    console.debug(macAddress,distance);

  }
}

module.exports.init = init;