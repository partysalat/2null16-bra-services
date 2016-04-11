var Gphoto = require("./src/server/bluetooth/camera/gphoto");


new Gphoto().summary().then(console.log).catch(console.error)