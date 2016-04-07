'use strict';
describe('statusHandler', function() {

  beforeEach(function() {
    this.statusHandler = require('../../../../src/server/handlers/statusHandler');
  });

  it('should be defined', function() {
    expect(this.statusHandler).toBeDefined();
  });

  it('should reply with ok', function() {
    var replySpy = jasmine.createSpy('reply');
    this.statusHandler({}, replySpy);

    expect(replySpy).toHaveBeenCalledWith('OK');
  });

});
