var _ = require("lodash"),
  noble = require("noble"),
  proximityService = require("./proximityService");
var MAC_ADDRESSES = [
  "2255db705ff8429881f79ac519d36ffd"
];

function init() {
  noble.on("discover", onDiscover)
}

function onDiscover(peripheral) {
  var macAddress = peripheral.uuid;
  var rssi = peripheral.rssi;
  if (_.includes(MAC_ADDRESSES, macAddress)) {
    var distance = proximityService.calcDistance(macAddress,rssi);
    

  }
}

module.exports.init = init;