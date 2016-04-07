'use strict';
var
  request = require('request-promise'),
    config = require("./../../../config/functionalConfig");

describe('/version', function() {

  it('responds with status code 200 and version', function(done) {
    var options = {
      method: 'GET',
      uri: config.baseUrl + '/internal/version',
      resolveWithFullResponse: true
    };

    request(options).then(function(response) {
      expect(response.statusCode).toBe(200);
      expect(response.body).toContain('Version');
      done();
    });
  });

});
