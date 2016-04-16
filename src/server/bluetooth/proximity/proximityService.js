'use strict';
var kalman = require("kalmanjs").default;
var filter = {};

module.exports.calcDistance = function (macAddress, rssi) {
  var distance = calculateDistance(rssi);
  if (!filter[macAddress]) {
    filter[macAddress] = new kalman();
  }
  return filter[macAddress].filter(distance);
};

function calculateDistance(rssi) {

  //var txPower = -59;//hard coded power value. Usually ranges between -59 to -65
  var txPower = -65;//hard coded power value. Usually ranges between -59 to -65

  if (rssi === 0) {
    return -1.0;
  }

  var ratio = rssi * 1.0 / txPower;
  if (ratio < 1.0) {
    return Math.pow(ratio, 10);
  }
  else {
    return (0.89976) * Math.pow(ratio, 7.7095) + 0.111;
  }
}