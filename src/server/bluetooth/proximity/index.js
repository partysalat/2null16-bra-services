'use strict';
var _ = require("lodash"),
  noble = require("noble"),
  proximityService = require("./proximityService"),
  braClient = require("./../../clients/braClient");

function init() {
  noble.on("discover", onDiscover);
}
var throttleFunctions = {};
var keeperInfo = {};
var CLEANUP_INTERVAL;

var THROTTLE_WAIT_TIME = 3000;
var INACTIVE_TIME = 6000;
var INTERVAL_DELAY = 5000;

function onDiscover(peripheral) {
  if (_.get(peripheral, "advertisement.localName") === "ITAG") {
    var macAddress = peripheral.uuid;
    var rssi = peripheral.rssi;
    keeperInfo[macAddress] = {
      distance:proximityService.calcDistance(macAddress, rssi),
      timestamp:Date.now()
    };
    if (!throttleFunctions[macAddress]) {
      throttleFunctions[macAddress] = _.throttle(function () {
        console.log("UPDATE USER STATE", macAddress);
        braClient.updateUserState(macAddress, {
          keeper: macAddress,
          distance: keeperInfo[macAddress].distance
        });
      }, THROTTLE_WAIT_TIME);
    }
    throttleFunctions[macAddress]();
  }
}

module.exports.init = init;



CLEANUP_INTERVAL = setInterval(function(){
  _.forIn(keeperInfo,function(keeper,macAddress){
      if(Date.now() - keeper.timestamp>INACTIVE_TIME){
        keeper.distance = Infinity;
        braClient.updateUserState(macAddress, {
          keeper: macAddress,
          distance: keeperInfo[macAddress].distance
        });
      }
  });
},INTERVAL_DELAY);
process.on('SIGINT', function() {
  // My process has received a SIGINT signal
  // Meaning PM2 is now trying to stop the process

  // So I can clean some stuff before the final stop
  clearInterval(CLEANUP_INTERVAL);

});