'use strict';
var jobQueue = Promise.resolve(),
spawn = require("child_process").spawn;

function spawnGphoto(commands) {
  jobQueue = jobQueue.catch(function (err) {
    console.log("Error occured", err);
  }).then(function () {
    return new Promise(function (resolve, reject) {
      var dataArr = [];
      console.log("SPAWN",commands);
      var childProcess = spawn("gphoto2", commands);
      childProcess.on('close', function (code) {
        return code ? reject(code) : resolve(dataArr);
      });
      childProcess.on('error', function (err) {
        console.log("error", err);
      });
      childProcess.stdout.on('data', function (data) {
        //console.log("data", data.toString("utf8"));
        dataArr.push(data);
      });
    });
  });
  return jobQueue;
}
function spawnGphotoAsStream(commands) {
  console.log("SPAWN",commands);
  var childProcess = spawn("gphoto2", commands);
  return childProcess.stdout;
}
module.exports = {
  spawnGphoto:spawnGphoto,
  spawnGphotoAsStream:spawnGphotoAsStream
};