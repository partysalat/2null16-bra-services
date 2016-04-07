'use strict';
var
  request = require('request-promise'),
  config = require("./../../../config/functionalConfig");

describe('/status', function() {

  it('responds with status code 200 and \'OK\'', function(done) {
    var options = {
      method: 'GET',
      uri: config.baseUrl + '/internal/status',
      resolveWithFullResponse: true
    };

    request(options).then(function(response) {
      expect(response.statusCode).toBe(200);
      expect(response.body).toBe('OK');
      done();
    });
  });

});
