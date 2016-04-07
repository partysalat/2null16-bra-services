'use strict';
describe('statusHandler', function () {
  beforeEach(function (done) {
    require('../../../src/server').create({
      port: 12345
    },function(err,server){
      this.server = server;
      done();
    }.bind(this));
  });

  it('should be defined', function (done) {
    this.server.inject("/internal/status", function (response) {
      expect(response.payload).toBe("OK");
      done();
    });
  });
});
