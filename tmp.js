var Gphoto = require("./src/server/bluetooth/camera/gphoto");
var noble = require("./src/server/bluetooth/support/noble");

//new Gphoto().summary().then(console.log).catch(console.error)
noble.init();
var _ = require("lodash");
var nobleLib = require("noble");
var map = {};
nobleLib.on("discover", function(per){
  if(!map[per.uuid]){
    console.log(_.get(per,"advertisement.localName"));
    map[per.uuid] = true;
  }
});