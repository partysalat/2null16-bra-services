var noble = require("noble");
function init() {
  noble.on('stateChange', function (state) {
    if (state === 'poweredOn') {
      start();

    } else {
      stop();
    }
  });
}
function stop(){
  noble.stopScanning();
}
function start(){
  noble.startScanning([], true);
  // noble.startScanning();
}
module.exports.init = init;
module.exports.stop = stop;
module.exports.start = start;


